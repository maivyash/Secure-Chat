// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MilitaryAuth
 * @dev Smart contract for military personnel authentication and access control
 */
contract MilitaryAuth {
    
    struct User {
        address walletAddress;
        string username;
        string role; // hq_staff, military_personnel, family_member
        string rank;
        string unit;
        uint256 registeredAt;
        uint256 lastLogin;
        bool isActive;
        bool isVerified;
    }
    
    struct AuthSession {
        address userAddress;
        uint256 timestamp;
        string ipHash;
        bool isActive;
    }
    
    struct MessageLog {
        address sender;
        address receiver;
        bytes32 messageHash;
        uint256 timestamp;
        string encryptionType;
        bool isEncrypted;
    }
    
    // Mappings
    mapping(address => User) public users;
    mapping(address => bool) public registeredUsers;
    mapping(address => AuthSession[]) public userSessions;
    mapping(bytes32 => MessageLog) public messageLogs;
    mapping(address => uint256) public userMessageCount;
    
    // Admin addresses (HQ Staff)
    mapping(address => bool) public admins;
    
    // Events
    event UserRegistered(address indexed userAddress, string username, string role, uint256 timestamp);
    event UserLoggedIn(address indexed userAddress, uint256 timestamp);
    event UserLoggedOut(address indexed userAddress, uint256 timestamp);
    event MessageSent(address indexed sender, bytes32 messageHash, uint256 timestamp);
    event UserVerified(address indexed userAddress, address indexed verifier, uint256 timestamp);
    event RoleChanged(address indexed userAddress, string newRole, uint256 timestamp);
    
    // Contract owner
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }
    
    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    
    /**
     * @dev Register a new user
     */
    function registerUser(
        string memory _username,
        string memory _role,
        string memory _rank,
        string memory _unit
    ) public {
        require(!registeredUsers[msg.sender], "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        users[msg.sender] = User({
            walletAddress: msg.sender,
            username: _username,
            role: _role,
            rank: _rank,
            unit: _unit,
            registeredAt: block.timestamp,
            lastLogin: 0,
            isActive: true,
            isVerified: false
        });
        
        registeredUsers[msg.sender] = true;
        
        // Auto-verify if HQ staff
        if (keccak256(bytes(_role)) == keccak256(bytes("hq_staff"))) {
            admins[msg.sender] = true;
            users[msg.sender].isVerified = true;
        }
        
        emit UserRegistered(msg.sender, _username, _role, block.timestamp);
    }
    
    /**
     * @dev User login - creates a new session
     */
    function login(string memory _ipHash) public onlyRegistered {
        require(users[msg.sender].isActive, "User account is not active");
        
        AuthSession memory newSession = AuthSession({
            userAddress: msg.sender,
            timestamp: block.timestamp,
            ipHash: _ipHash,
            isActive: true
        });
        
        userSessions[msg.sender].push(newSession);
        users[msg.sender].lastLogin = block.timestamp;
        
        emit UserLoggedIn(msg.sender, block.timestamp);
    }
    
    /**
     * @dev User logout
     */
    function logout() public onlyRegistered {
        uint256 sessionCount = userSessions[msg.sender].length;
        if (sessionCount > 0) {
            userSessions[msg.sender][sessionCount - 1].isActive = false;
        }
        
        emit UserLoggedOut(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Log a message on blockchain
     */
    function logMessage(
        address _receiver,
        bytes32 _messageHash,
        string memory _encryptionType
    ) public onlyRegistered {
        require(registeredUsers[_receiver], "Receiver not registered");
        
        messageLogs[_messageHash] = MessageLog({
            sender: msg.sender,
            receiver: _receiver,
            messageHash: _messageHash,
            timestamp: block.timestamp,
            encryptionType: _encryptionType,
            isEncrypted: true
        });
        
        userMessageCount[msg.sender]++;
        
        emit MessageSent(msg.sender, _messageHash, block.timestamp);
    }
    
    /**
     * @dev Verify a user (admin only)
     */
    function verifyUser(address _userAddress) public onlyAdmin {
        require(registeredUsers[_userAddress], "User not registered");
        users[_userAddress].isVerified = true;
        
        emit UserVerified(_userAddress, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Change user role (admin only)
     */
    function changeUserRole(address _userAddress, string memory _newRole) public onlyAdmin {
        require(registeredUsers[_userAddress], "User not registered");
        users[_userAddress].role = _newRole;
        
        // Update admin status if role is hq_staff
        if (keccak256(bytes(_newRole)) == keccak256(bytes("hq_staff"))) {
            admins[_userAddress] = true;
        }
        
        emit RoleChanged(_userAddress, _newRole, block.timestamp);
    }
    
    /**
     * @dev Deactivate user account (admin only)
     */
    function deactivateUser(address _userAddress) public onlyAdmin {
        require(registeredUsers[_userAddress], "User not registered");
        users[_userAddress].isActive = false;
    }
    
    /**
     * @dev Activate user account (admin only)
     */
    function activateUser(address _userAddress) public onlyAdmin {
        require(registeredUsers[_userAddress], "User not registered");
        users[_userAddress].isActive = true;
    }
    
    /**
     * @dev Get user details
     */
    function getUser(address _userAddress) public view returns (
        string memory username,
        string memory role,
        string memory rank,
        string memory unit,
        uint256 registeredAt,
        uint256 lastLogin,
        bool isActive,
        bool isVerified
    ) {
        User memory user = users[_userAddress];
        return (
            user.username,
            user.role,
            user.rank,
            user.unit,
            user.registeredAt,
            user.lastLogin,
            user.isActive,
            user.isVerified
        );
    }
    
    /**
     * @dev Get user session count
     */
    function getUserSessionCount(address _userAddress) public view returns (uint256) {
        return userSessions[_userAddress].length;
    }
    
    /**
     * @dev Get user message count
     */
    function getUserMessageCount(address _userAddress) public view returns (uint256) {
        return userMessageCount[_userAddress];
    }
    
    /**
     * @dev Check if user is admin
     */
    function isAdmin(address _userAddress) public view returns (bool) {
        return admins[_userAddress];
    }
    
    /**
     * @dev Verify message authenticity
     */
    function verifyMessage(bytes32 _messageHash) public view returns (
        address sender,
        address receiver,
        uint256 timestamp,
        bool exists
    ) {
        MessageLog memory log = messageLogs[_messageHash];
        return (
            log.sender,
            log.receiver,
            log.timestamp,
            log.sender != address(0)
        );
    }
}
