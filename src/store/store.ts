import { applySnapshot, flow, getSnapshot, types } from "mobx-state-tree";
import Counter from "./models/Counter";
import Address from "./models/Address";
import { deleteCounter } from "../api/deleteCounter";
import axios from "axios";

const CounterStore = types
  .model("CounterStore", {
    counters: types.array(Counter),
    addresses: types.map(Address),
    page: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 0),
    totalPages: types.optional(types.number, 0),
    totalCounter: types.optional(types.number, 0),
    loading: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get paginatedCounters() {
      return self.counters.slice(self.page * 20, (self.page + 1) * 20);
    },

    getAddress(id: string) {
      const address = self.addresses.get(id);
      return address
        ? `${address.house.address || 'No Address'}. кв. ${address.str_number_full}`
        : 'Loading...';
    },
  }))
  .actions((self) => {
    const fetchCounters = flow(function* fetchCounters() {

      self.loading = true;

      try {
        const response = yield axios.get(
          'http://showroom.eis24.me/api/v4/test/meters/',
          {
            params: {
              limit: 20,
              offset: self.page * 20,
            },
          }
        );
        const totalCounter: number = response.data.count;

        self.counters = response.data.results;
        self.totalCounter = totalCounter;
        self.totalPages = Math.ceil(totalCounter / 20);

        const addressIds = self.counters
          .map((counter) => counter.area.id)
          .filter(
            (id, index, array) =>
              array.indexOf(id) === index && !self.addresses.has(id)
          );

        if (addressIds.length > 0) {
          for (const id of addressIds) {
            yield fetchAddress(id);
          }
        }
      } catch (err) {
        console.error("Failed to get counters", err)
      }

      self.loading = false;
    });

    const fetchAddress = flow(function* fetchAddress(id: string) {
      self.loading = true;
      try {
        const response = yield axios.get(
          'http://showroom.eis24.me/api/v4/test/areas/',
          {
            params: { id },
          }
        );
        const data = response.data.results[0]

        if (data) {
          const address = {
            id: data.id,
            str_number_full: data.str_number_full || '',
            house: {
              address: data.house.address || '',
            },
          };
          self.addresses.put(address);
        }
      } catch (err) {
        console.error("Failed to fetch address", err)
      }
      self.loading = false;
    });

    const delCounter = flow(function* delCounter(id: string) {
      self.loading = true;
      try {
        yield deleteCounter(id);
        const updatedCounters = self.counters
          .filter((counter) => counter.id !== id)
          .map((counter) => getSnapshot(counter));
        applySnapshot(self.counters, updatedCounters);

        yield fetchCounters();
      } catch (err) {
        console.error("Failed to delete counter", err)
      }
      self.loading = false;
    })

    const setPage = (page: number) => {
      self.page = page;
    };

    return { fetchCounters, fetchAddress, delCounter, setPage }
  });

export default CounterStore;