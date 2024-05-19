package com.happyfood.reports.service;

import com.happyfood.reports.entity.Reports;

import java.util.List;

public interface IReportsService {
    List<Reports> getAllReports();
    Reports createReport(Reports report);
    Reports updateReport(Long reportId, Reports report);
}
