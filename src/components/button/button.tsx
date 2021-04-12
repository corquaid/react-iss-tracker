import React from "react";
import Button from "@material-ui/core/Button";

const CustomButton = (props: any) => {
    //    const { handleClick, label } = props;
    return <Button variant="contained" color="primary" onClick={props.onClick}>{props.label}</Button>;
};

export default CustomButton;
