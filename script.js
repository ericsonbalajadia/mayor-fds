const API_URL = "http://localhost:3000/students";

// Open the modal for adding a new student or editing an existing one
document.getElementById('openModalBtn').addEventListener('click', function() {
  document.getElementById('studentModal').classList.remove('hidden');
  document.getElementById('modalTitle').textContent = "Add New Student"; // Reset title
  document.getElementById('addStudentForm').reset(); // Reset form
  document.getElementById('studentId').value = ''; // Clear studentId
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
  document.getElementById('studentModal').classList.add('hidden');
});

document.getElementById('addStudentForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const studentId = document.getElementById('studentId').value;
  const studentData = {
    surname: document.getElementById('surname').value,
    firstname: document.getElementById('firstname').value,
    birthdate: document.getElementById('birthdate').value,
    gender: document.getElementById('gender').value,
    address: document.getElementById('address').value
  };

  if (studentId) {
    axios.put(`${API_URL}/${studentId}`, studentData)
      .then(response => {
        alert("Student updated successfully!");
        document.getElementById('studentModal').classList.add('hidden');
        fetchStudents(); // Refresh the students table
        document.getElementById('addStudentForm').reset(); // Reset the form
        document.getElementById('studentId').value = ''; // Clear the hidden input
      })
      .catch(error => {
        console.error("There was an error updating the student!", error);
      });
  } else {

    axios.post(API_URL, studentData)
      .then(response => {
        alert("Student added successfully!");
        document.getElementById('studentModal').classList.add('hidden');
        fetchStudents(); 
        document.getElementById('addStudentForm').reset(); 
      })
      .catch(error => {
        console.error("There was an error adding the student!", error);
      });
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

document.getElementById('sortBtn').addEventListener('click', function() {
  const sortField = document.getElementById('sortField').value;
  fetchStudents(sortField);
});

function fetchStudents(sortField = '') {
  let url = API_URL;
  if (sortField) {
    url += `/sort/${sortField}`;
  }

  axios.get(url)
    .then(response => {
      const students = response.data;
      const studentsBody = document.getElementById("studentsBody");
      studentsBody.innerHTML = ""; 

      students.forEach(student => {
        const formattedBirthdate = formatDate(student.Birthdate);
        const row = document.createElement("tr");
        
        row.innerHTML = `
          <td class="border px-4 py-2">${student.StudentID}</td>
          <td class="border px-4 py-2">${student.Surname}</td>
          <td class="border px-4 py-2">${student.Firstname}</td>
          <td class="border px-4 py-2">${formattedBirthdate}</td>
          <td class="border px-4 py-2">${student.Gender}</td>
          <td class="border px-4 py-2">${student.Address}</td>
          <td class="border px-4 py-2">
            <button 
              onclick="editStudent('${student.StudentID}')" 
              class="btn bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2">
              Edit
            </button>
            <button 
              onclick="deleteStudent('${student.StudentID}')" 
              class="text-red-500 hover:text-red-700">
              Delete
            </button>
          </td>
        `;
        studentsBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching students:", error);
    });
}

function editStudent(studentId) {
    
    axios.get(`${API_URL}/${studentId}`)
      .then(response => {
        console.log("Edit response:", response.data);  
        const student = response.data;
        
        if (!student) {
          throw new Error('No student data received');
        }

        document.getElementById('modalTitle').textContent = 'Edit Student';     
        document.getElementById('studentId').value = student.StudentID || student.studentId;
        document.getElementById('surname').value = student.Surname || student.surname;
        document.getElementById('firstname').value = student.Firstname || student.firstname;
        
        const birthdate = student.Birthdate || student.birthdate;
        if (birthdate) {
          const dateObj = new Date(birthdate);
          const formattedDate = dateObj.toISOString().split('T')[0];
          document.getElementById('birthdate').value = formattedDate;
        }
        
        document.getElementById('gender').value = student.Gender || student.gender;
        document.getElementById('address').value = student.Address || student.address;
        document.getElementById('studentModal').classList.remove('hidden');
      })
      .catch(error => {
        console.error("Error in editStudent:", error);
        console.error("Full error details:", {
          message: error.message,
          response: error.response,
          request: error.request
        });
        alert(`Error fetching student details. Please check the console for more information.`);
      });
}
  function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
      axios.delete(`${API_URL}/${studentId}`)
        .then(response => {
          alert("Student deleted successfully!");
          fetchStudents(); 
        })
        .catch(error => {
          console.error("There was an error deleting the student!", error);
        });
    }
  }
  
  document.getElementById('openModalBtn').addEventListener('click', function() {
    document.getElementById('modalTitle').textContent = 'Add New Student';
    document.getElementById('addStudentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('studentModal').classList.remove('hidden');
  });

  document.addEventListener('DOMContentLoaded', function() {
    axios.get('/api/students')
      .then(response => {
        const students = response.data;
        const studentsBody = document.getElementById('studentsBody');
        studentsBody.innerHTML = '';
        students.forEach(student => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="border px-4 py-2">${student.StudentID}</td>
            <td class="border px-4 py-2">${student.Surname}</td>
            <td class="border px-4 py-2">${student.Firstname}</td>
            <td class="border px-4 py-2">${student.Birthdate}</td>
            <td class="border px-4 py-2">${student.Gender}</td>
            <td class="border px-4 py-2">${student.Address}</td>
            <td class="border px-4 py-2">Actions</td>
          `;
          studentsBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error);
      });
  });

// Load students when the page loads
window.onload = () => fetchStudents(); 

