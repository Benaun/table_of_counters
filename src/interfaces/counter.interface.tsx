export interface ICounter {
    id: string,
    _type: string[],
    area: {
        id: string
    },
    installation_date: string | null;
    is_automatic: boolean | null,
    initial_values: number[];
    description: string | null
}
