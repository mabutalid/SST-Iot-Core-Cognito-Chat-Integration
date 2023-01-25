export interface IDateTimeUtil {
  currentUnixDateTime: () => number;
  dateToString: (d: Date | undefined) => string;
}

export const useDateTimeUtil = (): IDateTimeUtil => new DateTimeUtil();

class DateTimeUtil implements IDateTimeUtil {
  public currentUnixDateTime() {
    return Date.now() / 1000;
  }

  public dateToString(d: Date | undefined) {
    let dateOnly: Date;

    if (d) {
      dateOnly = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    } else {
      dateOnly = new Date(Date.UTC(1, 0, 1)); // Jan 1, 0001
    }

    return dateOnly.toISOString();
  }
}
