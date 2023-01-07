var NodeType = {
  Domain: {
    name: 'Domain',
    color: '#007bff',
    creatable: true,
  },
  Company: {
    name:'Company', 
    color:'#dc3545',
    creatable: true,
  },
  Person: {
    name:'Person',
    color:'#6c757d',
    creatable: true,
  },
  Entity: {
    name:'Entity', 
    color:'#ffc107',
    creatable: true,
  },
  Server: {
    name:'Server',
    color:'#28a745',
  },
  Article: {
    name:'Article',
    color:'#17a2b8',
  },
  Email: {
    name:'Article',
    color:'#b85d17',
  },
  Information: {
    name:'Information',
    color:'#9a17b8',
  },
}

class Node {
  constructor(title, type, parent=null) {
    this.title  = title;
    this.type   = type;
    this.parent = parent;
    this.details = 'none';
  }

  setDetails(details){
    this.details = details;
  }

  getDetails(){
    return this.details;
  }
}
