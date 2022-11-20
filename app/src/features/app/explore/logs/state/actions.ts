import { ApiResponse } from "../../../../../types/api";
import api from "../../../../../core/lib/api";
import { TraceoLog } from "../../../../../types/logs";
import { ThunkResult } from "../../../../../types/store";
import { logsLoaded } from "./reducers";

interface DateProps {
    startDate: number;
    endDate: number;
}
export const loadApplicationLogs = (appId: string, props: DateProps): ThunkResult<void> => {
    return async (dispatch, getStore) => {
        const application = getStore().application.application;
        if (!appId) {
            appId = application.id
        }

        const { data } = await api.get<ApiResponse<TraceoLog[]>>("/api/application/logs", {
            id: appId,
            ...props
        });
        dispatch(logsLoaded(data));
    };
};
