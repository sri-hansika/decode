// Question Sets for Decodedesk Quiz
// Each set contains Easy (10), Medium (10), and Hard (10) questions

export const questionSets = {
    A: {
        easy: [
            { abbreviation: "CPU", fullForm: "Central Processing Unit" },
            { abbreviation: "HTML", fullForm: "Hyper Text Markup Language" },
            { abbreviation: "URL", fullForm: "Uniform Resource Locator" },
            { abbreviation: "RAM", fullForm: "Random Access Memory" },
            { abbreviation: "ROM", fullForm: "Read Only Memory" },
            { abbreviation: "USB", fullForm: "Universal Serial Bus" },
            { abbreviation: "PDF", fullForm: "Portable Document Format" },
            { abbreviation: "LAN", fullForm: "Local Area Network" },
            { abbreviation: "WWW", fullForm: "World Wide Web" },
            { abbreviation: "GUI", fullForm: "Graphical User Interface" }
        ],
        medium: [
            { abbreviation: "API", words: ["Application", "Programming", "Interface"], distractors: ["Advanced", "Protocol", "Integration"] },
            { abbreviation: "SQL", words: ["Structured", "Query", "Language"], distractors: ["Standard", "Sequential", "System"] },
            { abbreviation: "HTTP", words: ["HyperText", "Transfer", "Protocol"], distractors: ["High", "Transmission", "Terminal"] },
            { abbreviation: "CSS", words: ["Cascading", "Style", "Sheets"], distractors: ["Computer", "System", "Creative"] },
            { abbreviation: "JSON", words: ["JavaScript", "Object", "Notation"], distractors: ["Java", "Oriented", "Syntax"] },
            { abbreviation: "DNS", words: ["Domain", "Name", "System"], distractors: ["Digital", "Network", "Service"] },
            { abbreviation: "FTP", words: ["File", "Transfer", "Protocol"], distractors: ["Fast", "Format", "Transmission"] },
            { abbreviation: "HTTPS", words: ["HyperText", "Transfer", "Protocol", "Secure"], distractors: ["High", "Terminal", "System"] },
            { abbreviation: "TCP", words: ["Transmission", "Control", "Protocol"], distractors: ["Transfer", "Terminal", "Text"] },
            { abbreviation: "IP", words: ["Internet", "Protocol"], distractors: ["Internal", "Information", "Integrated"] }
        ],
        hard: [
            { question: "What does AJAX stand for?", options: ["Asynchronous JavaScript and XML", "Advanced JavaScript and XML", "Automated JavaScript and XML", "Application JavaScript and XML"], answer: 0 },
            { question: "What does REST stand for?", options: ["Representational State Transfer", "Remote State Transfer", "Request State Transfer", "Resource State Transfer"], answer: 0 },
            { question: "What does SOLID stand for in programming?", options: ["Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion", "Simple, Optimized, Logical, Integrated, Dynamic", "Structured, Object-oriented, Linked, Integrated, Distributed", "None of the above"], answer: 0 },
            { question: "What does ORM stand for?", options: ["Object-Relational Mapping", "Object Resource Management", "Optimized Relational Model", "Object Reference Mapping"], answer: 0 },
            { question: "What does MVC stand for?", options: ["Model-View-Controller", "Module-View-Control", "Model-Virtual-Controller", "Main-View-Control"], answer: 0 },
            { question: "What does CRUD stand for?", options: ["Create, Read, Update, Delete", "Copy, Read, Update, Delete", "Create, Retrieve, Update, Delete", "Create, Read, Upload, Delete"], answer: 0 },
            { question: "What does JWT stand for?", options: ["JSON Web Token", "Java Web Token", "JavaScript Web Token", "Joint Web Token"], answer: 0 },
            { question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Model", "Document Oriented Model"], answer: 0 },
            { question: "What does SDK stand for?", options: ["Software Development Kit", "System Development Kit", "Standard Development Kit", "Simple Development Kit"], answer: 0 },
            { question: "What does IDE stand for?", options: ["Integrated Development Environment", "Interactive Development Environment", "Intelligent Development Environment", "Internal Development Environment"], answer: 0 }
        ]
    },
    B: {
        easy: [
            { abbreviation: "BIOS", fullForm: "Basic Input Output System" },
            { abbreviation: "OS", fullForm: "Operating System" },
            { abbreviation: "HDD", fullForm: "Hard Disk Drive" },
            { abbreviation: "SSD", fullForm: "Solid State Drive" },
            { abbreviation: "GPS", fullForm: "Global Positioning System" },
            { abbreviation: "WIFI", fullForm: "Wireless Fidelity" },
            { abbreviation: "CD", fullForm: "Compact Disc" },
            { abbreviation: "DVD", fullForm: "Digital Versatile Disc" },
            { abbreviation: "ISP", fullForm: "Internet Service Provider" },
            { abbreviation: "PC", fullForm: "Personal Computer" }
        ],
        medium: [
            { abbreviation: "PHP", words: ["Hypertext", "Preprocessor"], distractors: ["Personal", "Home", "Page", "Pre"] },
            { abbreviation: "XML", words: ["Extensible", "Markup", "Language"], distractors: ["Extra", "Extended", "Extreme"] },
            { abbreviation: "SMTP", words: ["Simple", "Mail", "Transfer", "Protocol"], distractors: ["Standard", "Secure", "System"] },
            { abbreviation: "POP", words: ["Post", "Office", "Protocol"], distractors: ["Point", "Presence", "Personal"] },
            { abbreviation: "IMAP", words: ["Internet", "Message", "Access", "Protocol"], distractors: ["Internal", "Mail", "Integrated"] },
            { abbreviation: "VPN", words: ["Virtual", "Private", "Network"], distractors: ["Verified", "Public", "Visual"] },
            { abbreviation: "DHCP", words: ["Dynamic", "Host", "Configuration", "Protocol"], distractors: ["Digital", "Domain", "Data"] },
            { abbreviation: "MAC", words: ["Media", "Access", "Control"], distractors: ["Machine", "Memory", "Master"] },
            { abbreviation: "NAT", words: ["Network", "Address", "Translation"], distractors: ["Node", "Area", "Terminal"] },
            { abbreviation: "VLAN", words: ["Virtual", "Local", "Area", "Network"], distractors: ["Visual", "Variable", "Verified"] }
        ],
        hard: [
            { question: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Cross-Origin Request Sharing", "Central Origin Resource Sharing", "Cross-Object Resource Sharing"], answer: 0 },
            { question: "What does CDN stand for?", options: ["Content Delivery Network", "Central Distribution Network", "Content Distribution Node", "Central Delivery Network"], answer: 0 },
            { question: "What does SSH stand for?", options: ["Secure Shell", "Secure System Host", "System Secure Host", "Secure Server Host"], answer: 0 },
            { question: "What does SSL stand for?", options: ["Secure Sockets Layer", "System Security Layer", "Secure System Link", "Standard Security Layer"], answer: 0 },
            { question: "What does TLS stand for?", options: ["Transport Layer Security", "Transfer Layer Security", "Terminal Layer Security", "Transmission Layer Security"], answer: 0 },
            { question: "What does YAML stand for?", options: ["YAML Ain't Markup Language", "Yet Another Markup Language", "Your Application Markup Language", "Yellow Abstract Markup Language"], answer: 0 },
            { question: "What does NoSQL stand for?", options: ["Not Only SQL", "No Structured Query Language", "Non Sequential Query Language", "New SQL"], answer: 0 },
            { question: "What does OAuth stand for?", options: ["Open Authorization", "Open Authentication", "Online Authorization", "Object Authorization"], answer: 0 },
            { question: "What does CI/CD stand for?", options: ["Continuous Integration/Continuous Deployment", "Code Integration/Code Deployment", "Central Integration/Central Deployment", "Continuous Implementation/Continuous Development"], answer: 0 },
            { question: "What does DDoS stand for?", options: ["Distributed Denial of Service", "Direct Denial of Service", "Dynamic Denial of Service", "Data Denial of Service"], answer: 0 }
        ]
    },
    C: {
        easy: [
            { abbreviation: "JPG", fullForm: "Joint Photographic Experts Group" },
            { abbreviation: "PNG", fullForm: "Portable Network Graphics" },
            { abbreviation: "GIF", fullForm: "Graphics Interchange Format" },
            { abbreviation: "MP3", fullForm: "MPEG Audio Layer 3" },
            { abbreviation: "ZIP", fullForm: "Zone Information Protocol" },
            { abbreviation: "FAQ", fullForm: "Frequently Asked Questions" },
            { abbreviation: "ASCII", fullForm: "American Standard Code for Information Interchange" },
            { abbreviation: "LED", fullForm: "Light Emitting Diode" },
            { abbreviation: "LCD", fullForm: "Liquid Crystal Display" },
            { abbreviation: "QR", fullForm: "Quick Response" }
        ],
        medium: [
            { abbreviation: "IPv4", words: ["Internet", "Protocol", "version", "4"], distractors: ["Internal", "Program", "Integrated"] },
            { abbreviation: "IPv6", words: ["Internet", "Protocol", "version", "6"], distractors: ["Internal", "Program", "Integrated"] },
            { abbreviation: "ARP", words: ["Address", "Resolution", "Protocol"], distractors: ["Advanced", "Routing", "Automatic"] },
            { abbreviation: "ICMP", words: ["Internet", "Control", "Message", "Protocol"], distractors: ["Internal", "Computer", "Integrated"] },
            { abbreviation: "UDP", words: ["User", "Datagram", "Protocol"], distractors: ["Unified", "Data", "Universal"] },
            { abbreviation: "NIC", words: ["Network", "Interface", "Card"], distractors: ["Node", "Internal", "Network"] },
            { abbreviation: "RAID", words: ["Redundant", "Array", "of", "Independent", "Disks"], distractors: ["Random", "Inexpensive", "Automated"] },
            { abbreviation: "NAS", words: ["Network", "Attached", "Storage"], distractors: ["Node", "Access", "Area"] },
            { abbreviation: "SAN", words: ["Storage", "Area", "Network"], distractors: ["System", "Server", "Secure"] },
            { abbreviation: "WLAN", words: ["Wireless", "Local", "Area", "Network"], distractors: ["Wide", "Web", "Wired"] }
        ],
        hard: [
            // CSE Abbreviations
            { question: "What does ACID stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Automated, Centralized, Integrated, Database", "Advanced, Consistent, Immediate, Data", "Application, Control, Input, Design"], answer: 0 },
            { question: "What does RISC stand for?", options: ["Reduced Instruction Set Computer", "Random Instruction Set Computer", "Rapid Instruction Set Computer", "Regular Instruction Set Computer"], answer: 0 },
            { question: "What does CISC stand for?", options: ["Complex Instruction Set Computer", "Central Instruction Set Computer", "Coded Instruction Set Computer", "Common Instruction Set Computer"], answer: 0 },
            { question: "What does DMA stand for?", options: ["Direct Memory Access", "Dynamic Memory Allocation", "Data Management Access", "Digital Memory Array"], answer: 0 },
            { question: "What does TCP/IP stand for?", options: ["Transmission Control Protocol/Internet Protocol", "Transfer Control Protocol/Internet Protocol", "Terminal Control Protocol/Internal Protocol", "Text Control Protocol/Integrated Protocol"], answer: 0 },
            { question: "What does CRUD stand for?", options: ["Create, Read, Update, Delete", "Copy, Read, Upload, Delete", "Create, Retrieve, Update, Delete", "Control, Read, Update, Display"], answer: 0 },
            { question: "What does JWT stand for?", options: ["JSON Web Token", "Java Web Token", "JavaScript Web Tool", "Joint Web Transfer"], answer: 0 },
            { question: "What does REST stand for?", options: ["Representational State Transfer", "Remote State Transfer", "Resource State Transfer", "Request State Transfer"], answer: 0 },
            { question: "What does MVC stand for?", options: ["Model-View-Controller", "Module-View-Control", "Model-Virtual-Controller", "Main-View-Component"], answer: 0 },
            { question: "What does CAP stand for?", options: ["Consistency, Availability, Partition Tolerance", "Control, Access, Protocol", "Central Application Processing", "Common Access Point"], answer: 0 },
            // OS Abbreviations
            { question: "What does LRU stand for?", options: ["Least Recently Used", "Last Resource Utilized", "Limited Resource Usage", "Logical Resource Unit"], answer: 0 },
            { question: "What does FCFS stand for?", options: ["First Come First Serve", "Fast Cache File System", "Forward Control Flow System", "Fixed Cycle Frame Sequence"], answer: 0 },
            // DBMS Abbreviations
            { question: "What does DDL stand for?", options: ["Data Definition Language", "Data Design Language", "Database Definition Language", "Dynamic Data Language"], answer: 0 },
            { question: "What does DML stand for?", options: ["Data Manipulation Language", "Data Management Language", "Database Modification Language", "Dynamic Manipulation Language"], answer: 0 },
            { question: "What does OLAP stand for?", options: ["Online Analytical Processing", "Online Application Processing", "Optimized Linear Application Processing", "Operational Logic Application Processing"], answer: 0 },
            { question: "What does OLTP stand for?", options: ["Online Transaction Processing", "Online Transfer Processing", "Operational Transaction Protocol", "Optimized Logical Transaction Processing"], answer: 0 },
            { question: "What does RAID stand for?", options: ["Redundant Array of Independent Disks", "Random Access Independent Disks", "Reliable Array of Integrated Disks", "Rapid Access Internal Disks"], answer: 0 },
            { question: "What does NUMA stand for?", options: ["Non-Uniform Memory Access", "Network Unified Memory Access", "Node Unified Memory Architecture", "Non-Universal Memory Allocation"], answer: 0 },
            // SE Abbreviations
            { question: "What does SDLC stand for?", options: ["Software Development Life Cycle", "System Design Life Cycle", "Secure Development Logical Cycle", "Standard Design Language Compiler"], answer: 0 },
            { question: "What does RAD stand for?", options: ["Rapid Application Development", "Resource Application Design", "Remote Application Deployment", "Reliable Application Development"], answer: 0 },
            { question: "What does UML stand for?", options: ["Unified Modeling Language", "Universal Modeling Language", "User Modeling Language", "Unified Management Language"], answer: 0 },
            { question: "What does CI/CD stand for?", options: ["Continuous Integration/Continuous Deployment", "Code Integration/Code Deployment", "Central Integration/Central Development", "Computer Integration/Computer Deployment"], answer: 0 },
            // AI Abbreviations
            { question: "What does MLP stand for?", options: ["Multi-Layer Perceptron", "Machine Learning Protocol", "Multiple Linear Processing", "Managed Learning Platform"], answer: 0 },
            { question: "What does NLP stand for?", options: ["Natural Language Processing", "Neural Learning Protocol", "Network Language Processing", "Normalized Linear Programming"], answer: 0 },
            { question: "What does GAN stand for?", options: ["Generative Adversarial Network", "General Application Network", "Global Area Network", "Graphic Analysis Network"], answer: 0 },
            // Electronics Abbreviations
            { question: "What does SCR stand for?", options: ["Silicon Controlled Rectifier", "System Control Register", "Semiconductor Controlled Resistor", "Signal Control Relay"], answer: 0 },
            { question: "What does MOSFET stand for?", options: ["Metal-Oxide-Semiconductor Field-Effect Transistor", "Multi-Oxide Silicon Field-Effect Transistor", "Magnetic-Oxide Semiconductor Field Transistor", "Metal-Organic Silicon Field-Effect Transistor"], answer: 0 },
            { question: "What does LED stand for?", options: ["Light Emitting Diode", "Laser Energy Device", "Luminous Electronic Display", "Linear Emission Diode"], answer: 0 },
            { question: "What does PCB stand for?", options: ["Printed Circuit Board", "Power Control Board", "Peripheral Control Bus", "Processor Circuit Base"], answer: 0 },
            { question: "What does HVDC stand for?", options: ["High Voltage Direct Current", "Heavy Voltage Distribution Circuit", "Hybrid Voltage Device Controller", "High Volume Direct Converter"], answer: 0 },
            // GK Abbreviations
            { question: "What does UNESCO stand for?", options: ["United Nations Educational, Scientific and Cultural Organization", "Universal Education and Scientific Community Organization", "United National Educational Services and Cultural Organization", "United Nations Environmental and Social Community Organization"], answer: 0 },
            { question: "What does NATO stand for?", options: ["North Atlantic Treaty Organization", "National Atlantic Trade Organization", "North American Treaty Organization", "National Allied Treaty Organization"], answer: 0 },
            { question: "What does ISRO stand for?", options: ["Indian Space Research Organisation", "International Space Research Organization", "Indian Scientific Research Organization", "Institute of Space Research Operations"], answer: 0 },
            { question: "What does DRDO stand for?", options: ["Defence Research and Development Organisation", "Development Research and Design Organization", "Defence Resource Development Office", "District Research and Development Organization"], answer: 0 },
            { question: "What does WHO stand for?", options: ["World Health Organization", "World Healthcare Organization", "Worldwide Health Organization", "World Hospital Organization"], answer: 0 },
            { question: "What does GDP stand for?", options: ["Gross Domestic Product", "General Development Program", "Global Domestic Production", "Growth Development Planning"], answer: 0 },
            { question: "What does GST stand for?", options: ["Goods and Services Tax", "General Sales Tax", "Government Service Tax", "Goods Standard Tax"], answer: 0 },
            { question: "What does RTI stand for?", options: ["Right to Information", "Resource Transfer Initiative", "Regional Trade Integration", "Right to Immunity"], answer: 0 },
            // Advanced GK Abbreviations
            { question: "What does CRISPR stand for?", options: ["Clustered Regularly Interspaced Short Palindromic Repeats", "Cell Research Institute for Scientific Protein Research", "Cellular Replication in Synthetic Protein Recombination", "Central Research Institute for Scientific Programming Research"], answer: 0 },
            { question: "What does LIGO stand for?", options: ["Laser Interferometer Gravitational-Wave Observatory", "Large International Gravitational Observatory", "Linear Interferometer Gravity Observatory", "Laboratory for Integrated Gravitational Observation"], answer: 0 }
        ]
    }
};

// Helper function to shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Get combined questions from all sets for a given level
export const getRandomQuestionsForLevel = (level) => {
    const levelMap = { 1: 'easy', 2: 'medium', 3: 'hard' };
    const difficulty = levelMap[level];

    // Combine all questions from sets A, B, and C
    const allQuestions = [
        ...questionSets.A[difficulty],
        ...questionSets.B[difficulty],
        ...questionSets.C[difficulty]
    ];

    // Question counts per level: Level 1 = 10, Level 2 = 20, Level 3 = 30
    const questionCount = level === 1 ? 10 : level === 2 ? 20 : 30;

    // Shuffle and select random questions
    const shuffled = shuffleArray(allQuestions);
    return shuffled.slice(0, questionCount);
};