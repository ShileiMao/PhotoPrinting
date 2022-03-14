package com.pdd.photoprint.photo.Utils;

import org.thymeleaf.util.DateUtils;

import java.util.Calendar;
import java.util.Date;

public class DateHelper {
    public static long differIn(Date cmp, Date target, int field) {
        long time1 = cmp.getTime();
        long time2 = target.getTime();

        switch(field) {
            case Calendar.MILLISECOND:
                return time2 - time1;

            case Calendar.SECOND:
                return (time2 - time1) / 1000;

            case Calendar.MINUTE:
                return  (time2 - time1) / (1000 * 60);

            case Calendar.HOUR:
                return  (time2 - time1) / (1000 * 60 * 60);

            default:
                throw new RuntimeException("Unsupported field: " + field);

        }
    }

    public static Date shiftDate(Date original, int field, int offset) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(original);

        calendar.add(field, offset);
        return calendar.getTime();
    }
}
