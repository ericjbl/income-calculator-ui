export const groupBy = (input: [] , key: string, secondKey: string) => {
    return input.reduce((acc: any, currentValue: any) => {
        let groupKey = currentValue[key][secondKey];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(currentValue);
        return acc;
    }, {});
  };