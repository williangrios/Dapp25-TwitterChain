// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.7;

contract TwitterChain {

    struct Tweet{
        uint id;
        address author;
        string content;
        uint createdAt;
    }

    struct Message{
        uint id;
        string content;
        address from;
        address to;
        uint createdAt;
    }

    mapping(uint => Tweet) private tweets;
    mapping(address => uint[]) private tweetsOf;
    mapping(address => uint) public numberTweetsOf;
    mapping (uint => Message[]) private conversations;
    //followers 
    mapping(address => address[]) private following;
    mapping (address => mapping (address => bool) ) private operators;
    uint public nextTweetId;
    uint public nextMessageId;

    event TweetSent(uint id,
        address indexed author,
        string content,
        uint createdAt);

    event MessageSent(uint id,
        string content,
        address indexed from,
        address indexed to,
        uint createdAt
        );

    function tweet(string calldata _content) external {
        _tweet(msg.sender, _content);
    }

    function tweetFrom(address _from, string calldata _content) external {
        _tweet(_from, _content);
    }

    function sendMessage(string calldata _content,  address _to) external {
        _sendMessage(_content, msg.sender, _to);
    }

    function sendMessageFrom(string calldata _content,  address _from, address _to) external {
        _sendMessage(_content, _from, _to);
    }
    
    function follow(address _followed) external {
        following[_followed].push(_followed);
    }

    function getLatestTweets(uint count) view external returns (Tweet[] memory){
        require(count > 0 && count <= nextTweetId, "Too few or many tweets to return");
        Tweet[] memory _tweets = new Tweet[](count);
        for (uint i = nextTweetId - count; i< nextTweetId ; i++){
            Tweet storage _tweetTemp = tweets[i];
            _tweets[i] =  Tweet(_tweetTemp.id, _tweetTemp.author, _tweetTemp.content, _tweetTemp.createdAt);
        }
        return _tweets;
    }

    function getTweetsOf(address _user) view external  returns (Tweet[] memory) {
        uint count = numberTweetsOf[_user];
        uint[] storage tweetIds = tweetsOf[_user];
        //require(count > 0 && count <= tweetIds.length, "Too few or many tweets to return");
        Tweet[] memory _tweets = new Tweet[](count);

        for (uint i = tweetIds.length - count; i< tweetIds.length ; i++){
            Tweet storage _tweetTemp = tweets[tweetIds[i]];
            _tweets[i] =  Tweet(_tweetTemp.id, _tweetTemp.author, _tweetTemp.content, _tweetTemp.createdAt);
        }
        return _tweets;
    }

    function _tweet(address _from, string memory _content) canOperate(_from) internal{
        tweets[nextTweetId] = Tweet(nextTweetId, _from, _content, block.timestamp);
        tweetsOf[msg.sender].push(nextTweetId);
        numberTweetsOf[msg.sender] += 1;
        emit TweetSent(nextTweetId, _from, _content, block.timestamp);
        nextTweetId ++;
    }

    function _sendMessage(string memory _content, address _from, address _to) canOperate(_from) internal{
        uint conversationId = uint256(uint160( _from)) + uint256( uint160(_to));
        conversations[conversationId].push(Message(nextMessageId, _content, _from, _to, block.timestamp));
        emit MessageSent(nextMessageId, _content, _from, _to, block.timestamp);
        nextMessageId ++;
    }

    modifier canOperate(address _from) {
        require(operators[_from][msg.sender] == true || _from ==msg.sender , "Operator not authorized");
        _;
    }

}