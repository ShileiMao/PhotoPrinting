package com.pdd.photoprint.photo;

import com.pdd.photoprint.photo.Utils.DateHelper;
import org.junit.jupiter.api.Test;
import org.thymeleaf.util.DateUtils;

import java.util.Calendar;
import java.util.Date;

public class TestDateHelper {
    @Test
    void testDateHelper() {
        Date date1 = DateUtils.create(2022, 02, 22, 10, 30, 10).getTime();
        Date date2 = DateUtils.create(2022, 02, 22, 10, 30, 10).getTime();
        Date date3 = DateUtils.create(2022, 02, 22, 10, 30, 15).getTime();
        Date date4 = DateUtils.create(2022, 02, 22, 10, 35, 10).getTime();
        Date date5 = DateUtils.create(2022, 02, 22, 11, 30, 15).getTime();
        Date date6 = DateUtils.create(2022, 02, 22, 9, 29, 15).getTime();

        long diff1 = DateHelper.differIn(date1, date2, Calendar.MILLISECOND);
        long diff2 = DateHelper.differIn(date1, date3, Calendar.SECOND);
        long diff3 = DateHelper.differIn(date1, date4, Calendar.MINUTE);
        long diff4 = DateHelper.differIn(date1, date5, Calendar.HOUR);
        long diff5 = DateHelper.differIn(date1, date6, Calendar.HOUR);

        assert(diff1 == 0);
        assert(diff2 == 5);
        assert(diff3 == 5);
        assert(diff4 == 1);
        assert(diff5 == -1);
    }

    @Test
    void testDateShift() {
        Date date1 = new Date();
        Date date2 = DateHelper.shiftDate(date1, Calendar.MINUTE, 10);
        Date date3 = DateHelper.shiftDate(date1, Calendar.HOUR, -5);
        Date date4 = DateHelper.shiftDate(date1, Calendar.DATE, 3);

        long diff1 = (date2.getTime() - date1.getTime()) / (1000 * 60);
        long diff2 = (date3.getTime() - date1.getTime()) / (1000 * 60 * 60);
        long diff3 = (date4.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);

        assert (diff1 == 10);
        assert (diff2 == -5);
        assert (diff3 == 3);

    }
}
