import { v4 } from "uuid"
import { Dropdown } from 'bootstrap'

const RANDOMUSERME_API = "https://randomuser.me/api/"
const form = document.querySelector(".profile-form")
const profilesCount = document.querySelector("#profiles-count")
const profilesGender = document.querySelector("#profiles-gender")
const profilesNat = document.querySelector("#profiles-nationality")
const profilesLogin = document.querySelector("#profiles-login")
const profiles = document.querySelector(".profiles>.row")
const profileTemplate = document.querySelector("#profile-template")
const profilesCard = document.querySelector(".profiles-card")
const profilesCardRow = document.querySelector(".profiles-card>.row")
const profileCardTemplate = document.querySelector("#profile-card-template")
const overlay = document.querySelector('.profiles-card__overlay')
let profileCards = []

form.addEventListener("submit", e => {
    e.preventDefault()

    const results = profilesCount.value
    const gender = profilesGender.value
    const nat = profilesNat.value
    const login = profilesLogin.checked

    if (results > 0) {
        const param = checkParameters({results, gender, nat, login})
        render(param)
    } else {
        alert("Count must be bigger than 0")
        e.target.reset()
        return
    }
    
    e.target.reset()
    profiles.innerHTML = ""
})

profiles.addEventListener('click', e => {
    if(!e.target.matches(".profile__overlay")) return
    
    const id = e.target.parentElement.dataset.id
    console.log(profileCards)
    const profileCard = profileCards.find(el => el.dataset.id === id)
    console.log(profileCard)
    addProfileCards(profileCard)
})

overlay.addEventListener("click", e => {
    const profileCard = e.target.nextElementSibling.children[0]
    removeProfileCards(profileCard)
})

function addProfileCards(profileCard) {
    profilesCardRow.appendChild(profileCard)
    overlay.style.display = "flex"
    profilesCard.style.display = "flex"
}

function removeProfileCards(profileCard) {
    profilesCardRow.removeChild(profileCard)
    overlay.style.display = "none"
    profilesCard.style.display = "none"
}

function checkParameters(obj) {
    let parameters = ""
    //console.log(obj)
    for (key in obj) if(!obj[key]) delete obj[key]
    obj.login = (!obj.login ? (obj.exc, obj.exc = "login") : "");
    delete obj.login;
    for (key in obj) {
        parameters +=  `&${key}=${obj[key]}`
    }
    // console.log(obj)
    return parameters
}

async function render(param) {
    const result = await requestProfile(param)
    console.log(result)
    const l = result.length
    for(let i = 0; i < l; i++) {
        let flag = "https://flagcdn.com/16x12/" + result[i].nat.toLowerCase() + ".png"
        result[i].uuid = v4()
        profileRender(result[i], flag, i)
        profileCardRender(result[i], flag, i)
    }
}

async function requestProfile(param) {
    const data = await fetch(RANDOMUSERME_API + "?" + param)
        .then(response => response.json())
        .catch(error => console.error(error));

    return data.results
}

function profileRender(results, flag, i) {
    const templateClone = profileTemplate.content.cloneNode(true)
    const profile = templateClone.querySelector('.profile')
    const profileImage = templateClone.querySelector('.profile__image')
    const name = templateClone.querySelector('.profile__name span')
    const profileFlag = templateClone.querySelector('.profile__flag')
    const profileEmail = templateClone.querySelector('.profile__email')
    const number = templateClone.querySelector('.profile__number')
    profile.dataset.id = results.uuid
    profileImage.setAttribute("src", results.picture.medium)
    name.innerText = `${results.name.first} ${results.name.last}`
    profileFlag.setAttribute("src", flag)
    profileEmail.innerText = results.email
    number.innerText = i + 1
    profiles.appendChild(templateClone)
}

function profileCardRender(results, flag, i) {
    const templateClone = profileCardTemplate.content.cloneNode(true)
    const profileCard = templateClone.querySelector('.profile-card')
    profileCard.dataset.id = results.uuid
    const profileImage = templateClone.querySelector('.profile-card__image img')
    const name = templateClone.querySelector('.profile-card__name span')
    const profileFlag = templateClone.querySelector('.profile-card__flag')
    const age = templateClone.querySelector('.profile-card__age span')
    const genderMaleIcon = templateClone.querySelector('.profile-card__gender .bi-gender-male')
    const genderFemaleIcon = templateClone.querySelector('.profile-card__gender .bi-gender-female')
    const gender = templateClone.querySelector('.profile-card__gender span')
    const profileEmail = templateClone.querySelector('.profile-card__email span')
    const profileCell = templateClone.querySelector('.profile-card__cell span')
    const profileAddress = templateClone.querySelector('.profile-card__address span')
    const number = templateClone.querySelector('.profile-card__number')
    profileImage.setAttribute("src", results.picture.large)
    name.innerText = `${results.name.first} ${results.name.last}`
    profileFlag.setAttribute("src", flag)
    age.innerText = results.dob.age
    if (results.gender === "male") {
        genderMaleIcon.style.display = "block"
    } else {
        genderFemaleIcon.style.display = "block"
    }
    gender.innerText = results.gender
    profileEmail.innerText = results.email
    profileCell.innerText = results.cell
    const address = results.location
    profileAddress.innerText = `${address.street.number} - ${address.street.name} - ${address.city} - ${address.state} - ${address.country}`
    if(results.login) {
        const profileUserName = templateClone.querySelector('.profile-card__username')
        const profilePassword = templateClone.querySelector('.profile-card__password')
        profileUserName.children[1].innerText = results.login.username
        profilePassword.children[1].innerText = results.login.password
        profileUserName.classList.remove("d-none")
        profilePassword.classList.remove("d-none")
    }
    number.innerText = i + 1
    profileCards.push(templateClone.firstElementChild)
}