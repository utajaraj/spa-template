import { notification } from 'antd';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
import type { NotificationPlacement } from 'antd/es/notification/interface';

export const notify = (type: NotificationType, title: string, description = "") => {
    notification[type]({
        message: title,
        description: description,
        placement: "topRight",
    })
}