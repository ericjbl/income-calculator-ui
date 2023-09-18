import dayjs,{ Dayjs } from 'dayjs'

export const generateItemId = () => {
    const yearMonthDay = dayjs().year().toString() + dayjs().month().toString() + dayjs().date().toString()
    return Math.floor(Math.random() * 100).toString() + yearMonthDay
}

export const getChipColor = (status: string) => {
    let color: string
    switch (status) {
        case 'N/A': {
            color = '#979797'
            break
        }
        // case 'Not Started': {
        //     color = 'info'
        //     break
        // }
        case 'Completed': {
            color = '#27ab4d'
            break
        }
        case 'Pending Data': {
            color = '#b32123'
            break
        }
        default: {
            color = '#128cc1'
        }   
    }
    return color

}

export const groupBy = (input: [] , key: string, secondKey: string) => {
    return input.reduce((acc: any, currentValue: any) => {
        let groupKey = currentValue[key][secondKey];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(currentValue);
        return acc;
    }, {});
}

export const getDaysToInclude = (startDate: Dayjs, endDate: Dayjs, reportStartDate: Dayjs, reportEndDate: Dayjs) => {
    let realEndDate: Dayjs = endDate > reportEndDate ? reportEndDate : endDate
    return startDate < reportStartDate ? realEndDate?.diff(reportStartDate, 'days') : realEndDate?.diff(startDate, 'days') 
}

export const calculateTotal = (type: string, daysToInclude: number, base: number) => {
    let total: number
    switch (type) {
        case 'Annual': {
            total = (daysToInclude * base)/365
            break
        }
        case 'Monthly': {
            total = (base * (12/365) * daysToInclude)
            break
        }
        case 'Semi-Monthly': {
            total = (base * (24/365) * daysToInclude)
            break
        }
        case 'Bi-Weekly': {
            total = (base/14) * daysToInclude
            break
        }
        case 'Weekly': {
            total = (base/7) * daysToInclude
            break
        }
        case 'Year To Date': {
            total = base
            break
        }
        default: {
            total = 0
        }   
    }
    return total
}