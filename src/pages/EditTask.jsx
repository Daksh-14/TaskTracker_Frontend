import React, { useState, useRef,useEffect } from 'react';
import axiosInstance from '../config/axiosconfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Editor from '../components/Editor';
import '../style/CreateTask.css';
import Loader from '../components/Loader';
import { useParams ,useNavigate} from 'react-router-dom';

const EditTask=()=>{
    const [assigned,setAssigned]=useState([])
    const [loading,setLoading]=useState(false);
     const [formData, setFormData] = useState({
        title: '',
        description: 'Add task description here',
        dueDate: new Date(),
        files: [],
        links: [],
        hours:0,
        min:0
      });
      const fileInputRef = useRef(null);
      const [linkInput, setLinkInput] = useState('');
      const { task } = useParams();
      const navigate=useNavigate();
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Create a FormData object
        const data = new FormData();
        let date=formData.dueDate;
        date.setHours(formData.hours,formData.min,0);
        date=date.toUTCString();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('dueDate', date);
        formData.files.forEach(file => {
          data.append('files', file);
        });
    
        formData.links.forEach(link => {
          data.append('links', link);
        });
    
        try {
          const response = await axiosInstance.put(`task/${task}/update`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setFormData({
            title: '',
            description: '',
            dueDate: new Date(),
            files: [],
            links: [],
            hours:23,
            min:59
          });
    
          fileInputRef.current.value = null;
          navigate(`../`);
        } catch (error) {
          console.error('Error adding task', error);
        }
        finally{
          setLoading(false);
        }
      };
    
      const onChangeHandler = (name, value) => {
        if(name=='hours'){
          if(value<0)value=0;
          if(value>23)value=23;
        }
        if(name=='min'){
          if(value<0)value=0;
          if(value>59)value=59;
        }
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };
    
      const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFormData((prevData) => ({
          ...prevData,
          files: [...prevData.files, ...newFiles]
        }));
      };
    
      const handleRemoveFile = (index) => {
        const newFiles = formData.files.filter((_, i) => i !== index);
        setFormData((prevData) => ({
          ...prevData,
          files: newFiles
        }));
        if (newFiles.length === 0) {
          fileInputRef.current.value = null;
        }
      };
    
      const handleAddLink = () => {
        if (linkInput) {
          setFormData((prevData) => ({
            ...prevData,
            links: [...prevData.links, linkInput]
          }));
          setLinkInput('');
        }
      };
    
      useEffect(()=>{
        const fetch=async()=>{
            setLoading(true);
            try{
                const {data}=await axiosInstance.get(`task/${task}/update`);
                // console.log(res.data);
                const dd=new Date(data.Form.duedate)
                // console.log(dd.getHours())
                setFormData(()=>({
                  title: data.Form.title || '',
                  description: data.Form.description || '',
                  dueDate: new Date(dd),
                  files: [],
                  links: [],
                  hours:dd.getHours(),
                  min:dd.getMinutes()
                }))
            }catch(err){
                console.log(err);
            }
            finally{
                setLoading(false);
            }
        }
        fetch()
     },[])

      const handleRemoveLink = (index) => {
        const newLinks = formData.links.filter((_, i) => i !== index);
        setFormData((prevData) => ({
          ...prevData,
          links: newLinks
        }));
      };
      
      return (
        <>
        {loading?<div style={{height:'100vh',width:'100vw',display:"flex",alignItems:'center',justifyContent:'center'}}>
        <Loader/>
        </div>:(
        <div className="CreateTask_outer">
          <div className="CreateTask_layout">
            <div className='Createtask_heading'><h1>Add a New Task</h1></div>
            <form onSubmit={handleSubmit}>
              <div className="CreateTask_data">
                <div className="CreateTask_title">
                  <label htmlFor="title">Title</label>
                  <input
                    className='task_input'
                    type="text"
                    name="title"
                    onChange={(e) => onChangeHandler('title', e.target.value)}
                    value={formData.title}
                    placeholder="Task Title"
                    required
                  />
                </div>
                <div className="CreateTask_desc">
                  <label htmlFor="description">Description</label>
                  <Editor formData={formData} setFormData={setFormData} />
                </div>
                <div className="CreateTask_date">
                  <div className='Date_value'>
                    <label htmlFor="dueDate">Due Date :</label>
                    <DatePicker
                      selected={formData.dueDate}
                      onChange={(date) => onChangeHandler('dueDate', date)}
                      className="task_input"
                    />
                  </div>
                  <div className='Date_value'>
                    <label htmlFor="hours">Hours :</label>
                    <input className="time-input" name='hours' type='number' value={formData.hours} required onChange={(e) => onChangeHandler('hours', e.target.value)} placeholder='23'/>
                  </div>
                  <div className='Date_value'>
                    <label htmlFor="min">Min :</label>
                    <input className="time-input" name='min' type='number' value={formData.min} required onChange={(e) => onChangeHandler('min', e.target.value)} placeholder='59'/>
                  </div>
                </div>
                <div className="CreateTask_files">
                  <div >
                    <label htmlFor="files">Upload Files</label>
                    <input type="file" name="files" multiple onChange={handleFileChange} ref={fileInputRef} />
                  </div>
                  <div className='files_inputed'>
                    {
                      formData.files.map((file, index) => (
                        <div key={index}>
                          <span>{file.name}</span>
                          <button type="button" className="Createtask_Button" onClick={() => handleRemoveFile(index)}>Remove</button>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="CreateTask_links">
                  <label htmlFor="links">Add Links</label>
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="Enter URL and click Add"
                  />
                  <button type="button" className="Createtask_Button" onClick={handleAddLink}>Add Link</button>
                  <div className="links_preview">
                    {formData.links.map((link, index) => (
                      <div key={index} className="link_item">
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                        <button type="button" className="Createtask_Button" onClick={() => handleRemoveLink(index)}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="button_container">
                  <button className="Createtask_Button" type="submit">Update Task</button>
                </div>
                <div>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
        )}
        </>
      );
}

export default EditTask;