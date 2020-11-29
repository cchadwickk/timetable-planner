import { InputTemplate } from './object-templates';

export const INPUTDATA: InputTemplate[] = [
  { 
    id: 1,
    name: 'Get Subjects', 
    inputs:[], 
    buttons: ['GO'],
    servicetouse: 'timetable',
    apiinfo: {
      'GO': {
        'method': 'GET',
        'path': '/subject'
      }
    } 
  },
  { 
    id: 2, 
    name: 'Get Courses', 
    inputs: ['SubjectCode'], 
    buttons: ['GO'],
    servicetouse: 'timetable',
    apiinfo: {
      'GO': {
        'method': 'GET',
        'path': '/subject/-$SubjectCode-/course'
      }
    }  
  },
  { 
    id: 3, 
    name: 'Get Timetables', 
    inputs: ['SubjectCode', 'CourseCode', 'ComponentCode'], 
    buttons: ['GO'],
    servicetouse: 'timetable',
    apiinfo: {
      'GO': {
        'method': 'GET',
        'path': '/subject/-$SubjectCode-/course/-$CourseCode-/timetable/-$ComponentCode'
      }
    }      
  },
  { 
    id: 4, 
    name: 'Schedule', 
    inputs: ['ScheduleCode'], 
    buttons: ['CREATE', 'GET', 'DELETE'],
    servicetouse: 'timetable',
    apiinfo: {
      'GET': {
        'method': 'GET',
        'path': '/schedule/-$ScheduleCode-/scheduledata'
      },
      'DELETE': {
        'method': 'DELETE',
        'path': '/schedule/-$ScheduleCode-/'
      },
      'CREATE': {
        'method': 'POST',
        'path': '/schedule/-$ScheduleCode-/'
      }
    } 
  },
  { 
    id: 5, 
    name: 'Local Schedule', 
    inputs: ['SubjectCode', 'CourseCode'], 
    buttons: ['ADD', 'RESET'],
    servicetouse: 'schedules'
  },
  { 
    id: 6, 
    name: 'Update Schedule On Server', 
    inputs: ['ScheduleCode'], 
    buttons: ['GO'],
    servicetouse: 'timetable',
    apiinfo: {
      'GO': {
        'method': 'PUT',
        'path': '/schedule/-$ScheduleCode-/scheduledata'
      }
    }
  },
  { 
    id: 7, 
    name: 'Get All Schedules', 
    inputs: [], 
    buttons: ['GO'],
    servicetouse: 'timetable',
    apiinfo: {
      'GO': {
        'method': 'GET',
        'path': '/schedule/'
      }
    }
  },
  { 
    id: 8, 
    name: 'Delete All Schedules', 
    inputs: [], 
    buttons: ['GO'],
    servicetouse: 'timetable',
    apiinfo: {
      'GO': {
        'method': 'DELETE',
        'path': '/schedule/'
      }
    }
  }
];