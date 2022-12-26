import { unparse, parse } from 'papaparse';
import { camelCase } from 'lodash';

export type CsvRow = Record<string, string | CsvRow[]>;
export type RowError = {
    code: string,
    row: number,
    message: string,
    originalRow: CsvRow,
};

const COLUMN_DELIMITER = ',';

export class ValidationException extends Error {
    messageArr: RowError[];

    constructor(messageArr: RowError[]) {
        super('Validation Errors');
        this.messageArr = messageArr;
    }
}

export const parseCsv = (fileContent: string): CsvRow[] => {
    const { data, errors } = parse<CsvRow>(fileContent, {
        header: true,
        delimiter: COLUMN_DELIMITER,
        skipEmptyLines: true,
        transformHeader(h: string) {
            return camelCase(h.trim());
        }
    });

    if (errors.length > 0) {
        const errorMessage = errors.map((each) => ({
            code: each.code,
            row: each.row + 1,
            originalRow: data[each.row],
            message: each.message
        }));
        throw new ValidationException(errorMessage);
    }
    return data;
};

export const convertObjectToCsvString = <T>(rows: T[], addHeaders = true): string => unparse<T>(rows, {
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ',',
    header: addHeaders,
    newline: '\n',
});
