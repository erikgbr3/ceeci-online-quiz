import React from "react";
// import MiniDrawerEmployee from "./MiniDrawerEmployee";
import MiniDrawer from "./MiniDrawer";

const Drawer = (props) => {
    return (
      <MiniDrawer>
        {props.children}
      </MiniDrawer>
    );
};

 export default Drawer;