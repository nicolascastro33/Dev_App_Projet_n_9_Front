/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../__mocks__/store";
import { ROUTES } from "../constants/routes.js";


jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I upload a valid file", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const inputUploadFile = screen.getByTestId('file')
      const file = new File(['test file content'], 'test.png', {type: 'image/png',})

      fireEvent.change(inputUploadFile, {target: {files: [file],},})
      
      const storeBillsCreate = jest.spyOn(store.bills(), 'create');
      const handleClickUploadFile = jest.fn(newBill.handleChangeFile)
      inputUploadFile.addEventListener('change', handleClickUploadFile)
      fireEvent.change(inputUploadFile)
      expect(handleClickUploadFile).toHaveBeenCalled()

      const errorMessage = screen.queryByTestId('errorFormatMessage')
      expect(errorMessage.textContent).toBe('')
      expect(inputUploadFile.files[0]).toEqual(file)  
      expect(storeBillsCreate).toHaveBeenCalled()
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I upload an unvalid file", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const inputUploadFile = screen.getByTestId('file')
      const file = new File(['test file content'], 'test.txt', {type: 'text/plain',})

      fireEvent.change(inputUploadFile, {target: {files: [file],},})
      expect(inputUploadFile.files[0]).toEqual(file)

      const handleClickUploadFile = jest.fn(newBill.handleChangeFile)
      inputUploadFile.addEventListener('change', handleClickUploadFile)
      fireEvent.change(inputUploadFile)
      expect(handleClickUploadFile).toHaveBeenCalled()
      const errorMessage = screen.queryByTestId('errorFormatMessage')
      expect(errorMessage.textContent).toBe('Format invalide, veuillez uploader une image en format jpeg, jpg ou png')
      expect(inputUploadFile.value).toBe('')
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I submit the form with valid data", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I update my bill", async () => {
      const storeBillsUpdate = jest.spyOn(store.bills(), 'update');

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const bill = {
        email: 'a@a',
        type: 'Services en ligne',
        name:  'test_bill',
        amount: 30,
        date:  '2024-01-02',
        vat: '1',
        pct: 1,
        commentary: 'test_comments',
        fileUrl: undefined,
        fileName: 'test.png',
        status: 'pending'
      }

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      await newBill.updateBill(bill)

      expect(storeBillsUpdate).toHaveBeenCalledWith({"data": "{\"email\":\"a@a\",\"type\":\"Services en ligne\",\"name\":\"test_bill\",\"amount\":30,\"date\":\"2024-01-02\",\"vat\":\"1\",\"pct\":1,\"commentary\":\"test_comments\",\"fileName\":\"test.png\",\"status\":\"pending\"}", "selector": null})
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      expect(buttonNewBill.textContent).toBe('Nouvelle note de frais')
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})