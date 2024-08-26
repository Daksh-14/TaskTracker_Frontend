import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosconfig';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';

const TaskFilesLinks = () => {
  const { task } = useParams();
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removedLinks, setRemovedLinks] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await axiosInstance.get(`/task/${task}/file/update`);
        setFiles(JSON.parse(res.data.fileurls));
        setLinks(JSON.parse(res.data.links));
      } catch (error) {
        console.error('Error fetching task data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [task]);

  const handleRemoveFile = (index) => {
    const linkToRemove = files[index];
    setRemovedLinks((prev) => [...prev, linkToRemove]);
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleRemoveLink = (index) => {
    
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    try {
      const updateResponse = await axiosInstance.put(`/task/${task}/file/update`, {
        files,
        links,
      });

      axiosInstance.post(`/task/filesdelete`, {
        files: removedLinks,
      });

      navigate(`../${task}`)
    } catch (error) {
      console.error('Error updating files and links:', error);
    }
  };

  if (loading) return <Loader/>;
  return (
    <div style={{minHeight:'70vh', display:'flex', justifyContent:'center',alignItems:'center'}}>
      <div style={{
                    backgroundColor: 'rgb(251, 251, 253)',padding:'5vh 5vw',borderRadius:"2vh",boxShadow:'0 10px 10px 0 rgba(0, 0, 0, 0.2)'}}>
      <h1>Task Files and Links</h1>
      <div style={{margin:'2vh 0'}}>
        <h2>Files</h2>
        <ul>
          {files.length>0 && files.map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">Open File {index + 1}</a>
              <button onClick={() => handleRemoveFile(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{margin:'2vh 0'}}>
        <h2>Links</h2>
        <ul>
          {links.length>0 && links.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
              <button onClick={() => handleRemoveLink(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
};

export default TaskFilesLinks;
