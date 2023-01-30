export const addRowsWithCalculations = (data: any, fieldsToAdd: string[],keysum:any,keyaverage:any) => {

    const sum = () => {
        const row: any = {
            calculatedRow: true,
        }

        for (let parameter = 0; parameter < fieldsToAdd.length; parameter++) {

            const fieldToSum: string = fieldsToAdd[parameter];

            const values = []

            for (let j = 0; j < data.length; j++) {
                const row = data[j];

                const valueToAdd = row[fieldToSum]

                values.push(valueToAdd)

            }
            row[fieldToSum] = values.reduce((partialSum, a) => partialSum + a, 0)
            
        }
        
        row["key"] = keysum
        return row
    }

    const average = () => {

        const row: any = {
            calculatedRow: true,
        }

        for (let parameter = 0; parameter < fieldsToAdd.length; parameter++) {


            const fieldToSum: string = fieldsToAdd[parameter];

            const values = []

            for (let j = 0; j < data.length; j++) {
                const row = data[j];

                const valueToAdd = row[fieldToSum]

                values.push(valueToAdd)

            }
            row[fieldToSum] = (values.reduce((partialSum, a) => partialSum + a, 0)) / values.length
            
        }
        row["key"] = keyaverage

        return row

    }

    const DictionaryOfCalculation: any = {
        sum: sum,
        average: average,
    }

    const rowWithAverages: any = DictionaryOfCalculation.average()
    const rowWithTotals: any = DictionaryOfCalculation.sum()

    const newDataSet = [...data, rowWithAverages, rowWithTotals]

    return newDataSet


}