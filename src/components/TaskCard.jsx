import React from "react";
import { Link } from 'react-router-dom';
import "../style/TaskCard.css";

const TaskCard = ({taskid,title,duedate,firstname,lastname}) => {
  const date=new Date(duedate);
  console.log(date.toLocaleDateString());
  
  return (
    <div className="TaskCard_outer">
        <Link to={`../../task/${taskid}`} className="TaskCard-link">
            <div className="TaskCard-cover">
            <div className="TaskCard_details1">
                <div className="TaskCard_title">{title}</div>
                <div className="TaskCard_name">Created by : {firstname} {lastname}</div>
            </div>
            <div className="TaskCard_details2"><p>Due:{date.toLocaleDateString()}</p></div>
            </div>
        </Link>
    </div>

  );
};

export default TaskCard;
