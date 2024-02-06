/**
 * @jest-environment jsdom
 */
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import store from "../__mocks__/store";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.className).toBe('active-icon')

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then all the bills should be from the connected employee", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email:'a@a',
        type: 'Employee'
      }))
      const onNavigate = null
      const bill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      
      bill.getBills().then(data => {
        let sameEmail 
        data.forEach(element => {
          sameEmail = element.email === 'a@a' ? true : false
        }); 
        expect(sameEmail).toBeTruthy()
      });
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then all the bills dates should have the proper format", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email:'a@a',
        type: 'Employee'
      }))
      const onNavigate = null
      const bill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      
      bill.getBills().then(data => {      
        const uriRegEx = /^[0-9]{1,2} [A-Z]{1}[a-zé]{2}. [0-9]{2}$/
        let goodFormat
        data.forEach(element => {
           goodFormat = uriRegEx.test(element.date)
        }); 
        expect(goodFormat).toBe(true)
      });
      
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then all the corrupted data return bills dates with their initial format", () => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email:'a@a',
        type: 'Employee'
      }))
      const onNavigate = null
      const bill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      let goodFormat

      bill.getBills().catch(e => {  
        const uriRegEx = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
        let goodFormat
        data().forEach(element => {
          goodFormat = uriRegEx.test(element.date)
        }); 
        return goodFormat
      });
      expect(goodFormat).toBe('hello')
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on the Bills page and I click on the NewBill button", () => {
    test("Then I should see the form", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const bill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const handleClickNewBill = jest.fn(bill.handleClickNewBill)
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      buttonNewBill.addEventListener('click', handleClickNewBill)
      fireEvent.click(buttonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()

      const formNewBill = screen.queryByTestId('form-new-bill')
      expect(formNewBill).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on the bills page and I click on the Icon Eye", () => {
    test("Then a modal should open", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const bill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      }) 

      const handleClickIconEye = jest.fn(bill.handleClickIconEye)
      const eye = screen.getAllByTestId('icon-eye')
      eye[0].addEventListener('click', handleClickIconEye)
      userEvent.click(eye[0])
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})
