import { types } from "mobx-state-tree";

const Counter = types.model("Counter", {
    id: types.identifier,
    _type: types.array(types.string),
    area: types.model({
        id: types.string,
    }),
    installation_date: types.string,
    is_automatic: types.maybeNull(types.boolean),
    description: types.maybeNull(types.string),
    initial_values: types.array(types.number),
})

export default Counter