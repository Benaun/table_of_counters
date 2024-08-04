import { useEffect } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import CounterStore from "../store/store";
import { formateDate } from "../assets/formateDate";


const Table = observer(() => {
    const store = useLocalObservable(() => CounterStore.create())

    useEffect(() => {
        store.fetchCounters()
    }, [store.page])

    const handleDelete = async (counterId: string) => {
        try {
            await store.delCounter(counterId)
            store.fetchCounters();
        } catch (error) {
            console.error('Error deleting meter:', error);
        }
    };
    const getPageNumbers = () => {
        const totalPages = store.totalPages;
        const pages: (number | string)[] = [];

        pages.push(0);

        if (totalPages > 1) pages.push(1);
        if (totalPages > 2) pages.push(2);

        if (store.page > 3) {
            pages.push('...');
        }

        const startPage = Math.max(3, store.page - 1);

        const endPage = Math.min(totalPages - 2, store.page + 1);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (store.page < totalPages - 4) {
            pages.push('...');
        }

        for (let i = totalPages - 3; i < totalPages; i++) {
            if (i >= 3 && i !== store.page && i !== store.page + 1) {
                pages.push(i);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col items-center w-full h-screen overflow-hidden mx-auto">
            <div className="w-[1408px] flex flex-col h-full">
                <h1 className="text-2xl font-bold my-4">Список счётчиков</h1>
                <div className="overflow-y-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-200 sticky top-0 rounded-t-xl z-10">
                            <tr className="text-left text-gray-500">
                                <th className="p-2 text-center">&#8470;</th>
                                <th className="p-2">Тип</th>
                                <th className="p-2">Дата установки</th>
                                <th className="p-2">Автоматический</th>
                                <th className="p-2">Значение</th>
                                <th className="p-2">Адрес</th>
                                <th className="p-2">Примечание</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.counters.map((counter, index) => (
                                <tr key={counter.id} className="text-left border-b-2 cursor-pointer relative">

                                    <td className="p-2 text-center w-12">
                                        {store.page * 20 + index + 1}
                                    </td>

                                    <td className="p-2 w-[120px]">
                                        {counter._type[0]}
                                    </td>

                                    <td className="p-2 w-[160px]">
                                        {counter.installation_date
                                            ? formateDate(counter.installation_date)
                                            : "нет"
                                        }
                                    </td>
                                    <td className="p-2 w-32">
                                        {counter.is_automatic
                                            ? "да"
                                            : "нет"
                                        }
                                    </td>
                                    <td className="p-2 w-32">
                                        {counter.initial_values[0]}
                                    </td>
                                    <td className="p-2 w-[430px]">
                                        {store.getAddress(counter.area.id)}
                                    </td>
                                    <td className="p-2 w-[376px]">
                                        {counter.description
                                            ? counter.description
                                            : "нет примечания"
                                        }
                                    </td>
                                    <button
                                        className=" absolute top-1/2 right-9 -translate-y-1/2"
                                        onClick={() => handleDelete(counter.id)}
                                    >
                                        x
                                    </button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="sticky bottom-0 bg-gray-200 rounded-b-xl flex justify-end items-center p-1">
                        {pageNumbers.map((page, index) =>
                            typeof page === 'number' ? (
                                <button
                                className=" border-2 bg-white px-1 rounded-md"
                                    key={index}
                                    onClick={() => store.setPage(page)}
                                >
                                    {page + 1}
                                </button>
                            ) : (
                                <span key={index}>
                                    ...
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Table