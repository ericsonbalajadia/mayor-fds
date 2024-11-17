const API_URL = "http://localhost:3000/students";

document.getElementById("addStudentForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const newStudent = {
    surname: document.getElementById("surname").value,
    firstname: document.getElementById("firstname").value,
    birthdate: document.getElementById("birthdate").value,
    gender: document.getElementById("gender").value,
    address: document.getElementById("address").value
  };

  axios.post(API_URL, newStudent)
    .then(response => {
      alert("Student added successfully!");
      fetchStudents(); 
      document.getElementById("addStudentForm").reset(); 
    })
    .catch(error => {
      console.error("There was an error adding the student!", error);
    });
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
  
  function fetchStudents() {
    axios.get(API_URL)
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
              <button class="text-red-500" onclick="deleteStudent(${student.StudentID})">Delete</button>
            </td>
          `;
          studentsBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("There was an error fetching students!", error);
      });
  }
  

  

function deleteStudent(studentId) {
  axios.delete(`${API_URL}/${studentId}`)
    .then(response => {
      alert("Student deleted successfully!");
      fetchStudents(); 
    })
    .catch(error => {
      console.error("There was an error deleting the student!", error);
    });
}

window.onload = fetchStudents;
