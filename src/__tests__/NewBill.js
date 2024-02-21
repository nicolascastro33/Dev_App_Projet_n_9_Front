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
    jest.spyOn(console, 'error');
    const error = new Error('error')
    describe("Then I try to upload a valid file with bad data", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = null
      
      const store = {
        bills: jest.fn(() => ({
          create: jest.fn().mockRejectedValue(error),
        })),
      };  

      const e = {
        preventDefault: jest.fn(),
        target: {
          value: 'filePath',
        },
      };

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const file = new File(['test file content'], 'test.png', {type: 'image/png',})
      fireEvent.change(screen.getByTestId('file'), {target: {files: [file],},})
      
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      await handleChangeFile(e)

      expect(handleChangeFile).toHaveBeenCalled()
      expect(store.bills).toHaveBeenCalled()
    })
    test("And it catch an error", async () => {        
      expect(console.error).toHaveBeenCalledWith(error);
  });
  })
})

// test d'intégration Post
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I submit the form with valid data", () => {
    test("But there is fetch error and it fails with a 404 error", async () => {
      const errorConsole = jest.spyOn(console, "error");

      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = {
        bills: jest.fn(() => newBill.store),
        create: jest.fn(() => Promise.resolve({})),
        update: jest.fn(() => Promise.reject(new Error("404"))),
      };

      const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage });

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);
      await new Promise(process.nextTick);
      expect(errorConsole).toBeCalledWith(new Error("404"));
    })
    test("But there is fetch error and it fails with a 500 error", async () => {
      const errorConsole = jest.spyOn(console, "error");

      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = {
        bills: jest.fn(() => newBill.store),
        create: jest.fn(() => Promise.resolve({})),
        update: jest.fn(() => Promise.reject(new Error("500"))),
      };

      const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage });

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);
      await new Promise(process.nextTick);
      expect(errorConsole).toBeCalledWith(new Error("500"));
    })
  })
})



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I submit the form with valid data", () => {
    const storeBillsUpdate = jest.spyOn(store.bills(), 'update');
    test("Then it should post the new data and I should go to the page bill", async () => {
      const billConsole = jest.spyOn(console, 'log');
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      await window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'a@a',
      }))

      document.body.innerHTML = NewBillUI()
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()

      const onNavigate = (pathname, data) => {
        document.body.innerHTML = ROUTES({ pathname, data })
      }

      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      fireEvent.change(screen.getByTestId('expense-type'),{ target: {value: "Transports"}})
      fireEvent.change(screen.getByTestId('expense-name'),{ target: {value: "Bernard-TEST"}})
      fireEvent.change(screen.getByTestId('amount'),{ target: {value: 5}})
      fireEvent.change(screen.getByTestId('datepicker'),{ target: {value: "2024-12-12"}})
      fireEvent.change(screen.getByTestId('vat'),{ target: {value: 20}})
      fireEvent.change(screen.getByTestId('pct'),{ target: {value: 20}})
      fireEvent.change(screen.getByTestId('commentary'),{ target: {value: "No comments"}})
     
      newBill.fileName = "test.png"
      newBill.fileUrl = 'http://localhost/img/test.png'

      const handleSubmit = jest.fn(newBill.handleSubmit) 
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)
      await fireEvent.submit(form)

      expect(billConsole).toHaveBeenCalledWith({"amount": 5, "commentary": "No comments", "date": "2024-12-12", "email": "a@a", "fileName": "test.png", "fileUrl": "http://localhost/img/test.png", "name": "Bernard-TEST", "pct": 20, "status": "pending", "type": "Transports", "vat": "20"})
      expect(storeBillsUpdate).toHaveBeenCalled()
      const buttonNewtBill = screen.getByTestId('btn-new-bill')
      expect(buttonNewtBill.textContent).toBe('Nouvelle note de frais')
    })
  })
})

//Tests de la fonction updateBill
describe("Test of the function updateBill", () => {
  describe("When there is no error and the data are valid", () => {
    test("Then it update the bill", async () => {
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
  describe("When there is an error", () => {
    jest.spyOn(console, 'error');
    const error = new Error('error')
    test("Then it fails to update", async () => {
        const html = NewBillUI()
        document.body.innerHTML = html
        const store = {
          bills: jest.fn(() => ({
            update: jest.fn().mockRejectedValue(error),
          })),
        }; 
            
        const bill = { id: 1, name: 'error_test' };
        const onNavigate = jest.fn()
        const newBill = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })
        await newBill.updateBill(bill)
        expect(onNavigate).not.toHaveBeenCalled()
      });
      test("And it catch an error", async () => {        
        expect(console.error).toHaveBeenCalledWith(error);
    });
  });
})
