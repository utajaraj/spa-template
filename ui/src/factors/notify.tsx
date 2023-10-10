import { notification } from 'antd';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
import type { NotificationPlacement } from 'antd/es/notification/interface';

export const notify = (type: NotificationType, title: string, description?:any) => {
    notification[type]({
        message: title,
        description: description,
        placement: "top"
    })
}