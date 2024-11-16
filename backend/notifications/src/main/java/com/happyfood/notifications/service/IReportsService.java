package com.happyfood.notifications.service;


import com.happyfood.notifications.entity.Reports;

import java.util.List;

public interface IReportsService {
    List<Reports> getAllReports();
    Reports createReport(Reports report);
    Reports updateReport(Long reportId, Reports report);
}
