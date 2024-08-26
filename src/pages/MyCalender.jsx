import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axiosInstance from '../config/axiosconfig';
import '../style/Calender.css'
import { Link } from 'react-router-dom';


function MyCalendar() {
  const [events,setEvents]=useState([])
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlight,setHighlight]=useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/task/findall');
        const temp = response.data.map((d) => ({
          ...d,
          duedate: new Date(d.duedate).toLocaleString().split(',')[0],
        }));
        let arr=[];
        temp.forEach(e => {
          arr.push(e.duedate)
        });
        setHighlight(arr);
        setEvents(temp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const selectedDateString = selectedDate.toLocaleString().split(',')[0];
  // Find events for the selected date
  const selectedEvents = events.filter((event) =>
    event.duedate === selectedDateString
  );

  return (
    <div style={{display:'flex',justifyContent:'center'}}>
      <div>
        <div style={{width:'100%',display:'flex', justifyContent:'center', fontSize:'1.5rem',fontWeight:'bold'}}>Tasks Calendar</div>
      <Calendar
        className='calendar'
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) =>
            highlight.includes(date.toLocaleString().split(',')[0])
              ? 'highlight' // Apply your custom CSS class
              : ''
          }
        />
      {selectedEvents.length > 0 && (
        <div style={{
          marginTop:'2vh',
          display:'flex',
          justifyContent:'center'
        }}>
          <div style={{display:'flex', flexDirection:'column'}}>
          <p style={{fontSize:'1.3rem'}}>Events on {selectedDate.toDateString()}:</p>
          {selectedEvents.map((event, index) => (
            <div key={index} style={{margin:'0.5vh 0', backgroundColor:'#f0f4f8',textAlign:'center',padding:'0.5vh', borderRadius:'5px', color:'black'}}>
              <Link to='../'>{event.title}</Link>
            </div>
          ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default MyCalendar;
