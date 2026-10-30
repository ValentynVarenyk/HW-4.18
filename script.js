let studentsList = [];



async function getStudents() {
    try {
        const response = await fetch('http://localhost:3000/students');

        if (!response.ok) {
            throw new Error('Помилка отримання студентів');
        }

        const students = await response.json();

        studentsList = students;

        renderStudents(students);

    } catch (error) {
        console.error(error);
        alert('Не вдалося отримати список студентів');
    }
}



function renderStudents(students) {
    const tbody = document.querySelector('#students-table tbody');

    tbody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');

        const values = [
            student.id,
            student.name,
            student.age,
            student.course,
            student.skills.join(', '),
            student.email,
            student.isEnrolled ? 'Так' : 'Ні'
        ];

        values.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        const actions = document.createElement('td');

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Оновити';
        updateButton.onclick = () => updateStudent(student.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.onclick = () => deleteStudent(student.id);

        actions.appendChild(updateButton);
        actions.appendChild(deleteButton);

        row.appendChild(actions);

        tbody.appendChild(row);
    });
}



async function addStudent(e) {
    e.preventDefault();

    const student = {
        name: document.querySelector('#name').value,
        age: Number(document.querySelector('#age').value),
        course: document.querySelector('#course').value,
        skills: document.querySelector('#skills').value
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill !== ''),
        email: document.querySelector('#email').value,
        isEnrolled: document.querySelector('#isEnrolled').checked
    };

    try {
        const response = await fetch('http://localhost:3000/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання студента');
        }

        alert('Студента успішно додано!');

        document.querySelector('#add-student-form').reset();

        getStudents();

    } catch (error) {
        console.error(error);
        alert('Не вдалося додати студента');
    }
}



async function updateStudent(id) {
    const student = studentsList.find(student => student.id === id);

    if (!student) {
        return;
    }

    const name = prompt('Введіть нове ім’я:', student.name);

    if (name === null) return;

    const age = prompt('Введіть новий вік:', student.age);

    if (age === null) return;

    const course = prompt('Введіть новий курс:', student.course);

    if (course === null) return;

    const skills = prompt(
        'Введіть нові навички через кому:',
        student.skills.join(', ')
    );

    if (skills === null) return;

    const email = prompt('Введіть новий Email:', student.email);

    if (email === null) return;

    const isEnrolled = confirm('Студент записаний на курс?');

    const updatedStudent = {
        name: name,
        age: Number(age),
        course: course,
        skills: skills.split(',').map(skill => skill.trim()),
        email: email,
        isEnrolled: isEnrolled
    };

    try {
        const response = await fetch(
            `http://localhost:3000/students/${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            }
        );

        if (!response.ok) {
            throw new Error('Помилка оновлення студента');
        }

        alert('Дані студента успішно оновлено!');

        getStudents();

    } catch (error) {
        console.error(error);
        alert('Не вдалося оновити студента');
    }
}



async function deleteStudent(id) {
    const confirmDelete = confirm('Ви дійсно хочете видалити студента?');

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/students/${id}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Помилка видалення студента');
        }

        alert('Студента успішно видалено!');

        getStudents();

    } catch (error) {
        console.error(error);
        alert('Не вдалося видалити студента');
    }
}



document.querySelector('#get-students-btn')
    .addEventListener('click', getStudents);

document.querySelector('#add-student-form')
    .addEventListener('submit', addStudent);