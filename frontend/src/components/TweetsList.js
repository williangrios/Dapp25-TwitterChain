import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

const TweetsList = ({list}) => {

  
  function toDate (dateTimestamp){
    return (new Date(parseInt(dateTimestamp) * 1000)).toLocaleString()
  } 

  return (
    <>
      {list.length == 0 ? <label>No tweets to show</label>
      :
        <table className="table">
            <thead>
            <tr>
                <td>Tweet Id</td>
                <td>Author</td>
                <td>Content</td>
                <td>Date</td>
            </tr>
            </thead>
            <tbody>
            { list.map ((item) => 
                <tr key={item.id.toString()}>
                    <td>{item.id.toString()}</td>
                    <td>{item.author}</td>
                    <td>{item.content}</td>
                    <td>{toDate(item.createdAt.toString())}</td>
                </tr>
            )}
            </tbody>
        </table> 
      } 
      <hr/>
    </>
  )
}

export default TweetsList