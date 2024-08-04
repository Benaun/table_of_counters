export const formateDate = (date: string) => {
    const data = new Date(date);
    const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formatter.format(data).replace(/\//g, '.')
}