import { Button, ButtonProps } from "antd"
import * as React from 'react';
declare const ButtonTypes: readonly ["default", "primary", "ghost", "dashed", "link", "text"];
export type ButtonType = typeof ButtonTypes[number];
declare const ButtonShapes: readonly ["default", "circle", "round"];
export type ButtonShape = typeof ButtonShapes[number];
declare const ButtonHTMLTypes: readonly ["submit", "button", "reset"];
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];
export type LegacyButtonType = ButtonType | 'danger';
export declare function convertLegacyProps(type?: LegacyButtonType): ButtonProps;
interface MyButtonInterface {
    icon: any,
    text: string,
    type?: ButtonType,
    shape?: ButtonShape;
    size?: 'small' | 'middle' | 'large',
    disabled?: boolean,
    loading?: boolean | {
        delay?: number,
    },
    prefixCls?: string,
    className?: string,
    ghost?: boolean,
    danger?: boolean,
    block?: boolean,
    children?: React.ReactNode,
    style?: any,
    onClick?: any,
    htmlType?: "submit"
}

export default function MyButton(props: MyButtonInterface) {
    const myprops = { ...props }
    const { icon, text } = myprops
    delete myprops.icon
    return (
        <div style={{ padding: "15px 0", textAlign: "right" }}>
            <Button {...myprops} className="my-button" >
                <div className="buttonIconContainer">
                    {icon}
                </div>
                <span>
                    {text}
                </span>
            </Button>
        </div>
    )
}