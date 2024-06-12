import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Report {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  createdDate: Date;
  linkId: number;
  note: string;
  type: string;
  senderId: number;
  accusedId: number;
  senderName: string;
}
interface Reports {
  reportsPending: Report[];
  reportsFinished: Report[];
}
const initialState: Reports = {
  reportsPending: [],
  reportsFinished: [],
};
const ReportSlice = createSlice({
  name: 'Report',
  initialState,
  reducers: {
    setReports: (state: Reports, action: PayloadAction<Report[]>) => {
      state.reportsPending = action.payload.filter(
        report => report.status === 'PENDING',
      );
      state.reportsFinished = action.payload.filter(
        report => report.status === 'FINISHED',
      );
    },
    updateTheReport: (state: Reports, action: PayloadAction<Report>) => {
      const reportToUpdate = state.reportsPending.find(
        report => report.id === action.payload.id,
      );
      if (reportToUpdate) {
        reportToUpdate.status = 'FINISHED';
        state.reportsFinished.push(reportToUpdate);
        state.reportsPending = state.reportsPending.filter(
          report => report.id !== action.payload.id,
        );
      }
    },
    clearReports: (state: Reports) => {
      state.reportsPending = [];
      state.reportsFinished = [];
    },
  },
});

export const {setReports, updateTheReport, clearReports} = ReportSlice.actions;
export default ReportSlice.reducer;
