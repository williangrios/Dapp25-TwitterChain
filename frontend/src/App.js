import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import TweetsList from "./components/TweetsList";
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';

import TCContract from './artifacts/contracts/TwitterChain.sol/TwitterChain.json';

function App() {

  const [user, setUser] = useState({address: '', connected: false});

  const [writeTweet, setWriteTweet] = useState('');

  const [writePrivateMessage, setWritePrivateMessage] = useState('');
  const [writePrivateMessageTo, setWritePrivateMessageTo] = useState('');

  const [addressToFollow, setAddressToFollow] = useState('');

  const [allTweetsOf, setAllTweetsOf] = useState([]);
  const [allLatestTweets, setAllLatestTweets] = useState([]);

  const [numTweets, setNumTweets] = useState('');

  const contractAddress ='0x1Fc950A1D1b493E779768a26775C768539617e49';

  let contractDeployed = null;
  let contractDeployedSigner = null;

  async function getProvider(connect = false){
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      if (contractDeployed == null){
        contractDeployed = new ethers.Contract(contractAddress, TCContract.abi, provider)
      }
      if (contractDeployedSigner == null){
        contractDeployedSigner = new ethers.Contract(contractAddress, TCContract.abi, provider.getSigner());
      }
      if (connect && user.connected == false){
        let userAcc = await provider.send('eth_requestAccounts', []);
        setUser({address: userAcc[0], connected: true});
        const resp  = await contractDeployed.getTweetsOf( userAcc[0]);  
        setAllTweetsOf( resp)  
      }  
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  async function handleConnect(){
    try {
      getData(true);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  async function disconnect(){
    try {
      setUser({address: '', connected: false});
      setAllTweetsOf([])
    } catch (error) {
      
    }
  }
  
  useEffect(() => {
    getData()
  }, [])

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function getData(connect = false) {
    await getProvider(connect);
    
    if(contractDeployed){
      try {
        const numTweetsTemp = await contractDeployed.nextTweetId();
        setNumTweets(numTweetsTemp.toString());
        console.log('nexttweetid');
        if (parseInt(numTweetsTemp) > 0){
          const respAll  = await contractDeployed.getLatestTweets(numTweetsTemp.toString());  
          setAllLatestTweets( respAll)  
        }
      } catch (error) {
        toastMessage (error.reason);
      }
    }else{
      toastMessage("Install metamask and connect yourself")
    }
  }

  async function handleTweet(){
    await getProvider(true);
    try {
      const resp  = await contractDeployedSigner.tweet(writeTweet);  
      toastMessage("Tweeted")
    } catch (error) {
      toastMessage(error.reason);
    }
  }

  async function handleSendMessage(){
    await getProvider(true);
    try {
      const resp  = await contractDeployedSigner.sendMessage(writePrivateMessage, writePrivateMessageTo);  
      toastMessage("Sent")
    } catch (error) {
      toastMessage(error.reason);
    }
  }


  async function handleAddressToFollow(){
    await getProvider(true);
    try {
      const resp  = await contractDeployedSigner.follow(addressToFollow);  
      toastMessage("Following")
    } catch (error) {
      toastMessage(error.reason);
    }
  }

  return (
    <div className="App">
      
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="TWITTER CHAIN" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        {
          user.connected ==false ?<>
            <h2>Connect your wallet</h2>
            <button className="btn btn-primary col-3" onClick={handleConnect}>Connect</button>
          </>
          :<>
            <h2>User data</h2>
            <label>User account: {user.address}</label>
            <button className="btn btn-primary col-3" onClick={disconnect}>Disconnect</button>

            <h2>Write tweet</h2>
            <div className="row col-3 mb-3 justify-content-center">
              <input type="text" placeholder="Write tweet" className="mb-1" onChange={(e) =>setWriteTweet(e.target.value)} value={writeTweet}/>
              <button className="btn btn-primary" onClick={handleTweet}>Tweet</button>
            </div>

            {/* <h2>Write private message</h2>
            <div className="row col-3 mb-3 justify-content-center">
              <input type="text" placeholder="Write messate" className="mb-1" onChange={(e) =>setWritePrivateMessageTo(e.target.value)} value={writePrivateMessageTo}/>
              <input type="text" placeholder="To" className="mb-1" onChange={(e) =>setWritePrivateMessage(e.target.value)} value={writePrivateMessage}/>
              <button className="btn btn-primary" onClick={handleSendMessage}>Send private message</button>
            </div>    */}

     
            <hr/>
        <h2>My Latest tweets</h2>
        <TweetsList list={allTweetsOf}/>

            <h2>Want to follow someone?? Type address here</h2>
            <div className="row col-3 mb-3">
              <input type="text" className="mb-1" onChange={(e) =>setAddressToFollow(e.target.value)} value={addressToFollow}/>
              <button className="btn btn-primary" onClick={handleAddressToFollow}>Follow</button>
            </div>   

            <button className="btn btn-primary" onClick={() => console.log(allLatestTweets)}>teste</button>
 
            </>
        }
        <hr/>

        { allLatestTweets && <>
          <h2>Latest tweets from all users</h2>
          <TweetsList list={allLatestTweets}/></>
        }
        

        {!allLatestTweets  && <><label>No tweets</label></>} 



{/* {allTokens && <>
          <h2>All tokens minted</h2>
          <div className="row col-10 mb-3 ">
       
          <table className="table">
            <thead>
              <tr>
                <td style={{width: 100}}>Id</td>
                <td style={{width: 100}}>Owner</td>
                <td style={{width: 100}}>Generation</td>
                <td style={{width: 100}}>Gene A</td>
                <td style={{width: 100}}>Gene B</td>
                <td style={{width: 100}}>Img</td>
              </tr>
            </thead>
            <tbody>
              {
              allTokens.map((item, ind) =>  
                <tr key={ind}>
                  <td>{item.id}</td>
                  <td>{item.owner}</td>
                  <td>{item.generation}</td>
                  <td>{item.geneA}</td>
                  <td>{item.geneB}</td>
                  <td><img style={{width: 35, heigth: 35}} src={item.img} /></td>
                </tr>
              )}                
            </tbody>
          </table>
          </div></>
        } */}

      </WRContent>
      <WRTools react={true} hardhat={true} bootstrap={true} solidity={true} css={true} javascript={true} infura={true} ethersjs={true} />
      <WRFooter />         
      
    </div>
  );
}

export default App;
