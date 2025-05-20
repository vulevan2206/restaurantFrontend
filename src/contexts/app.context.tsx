import { ProductOrder } from "@/types/product.type";
import { User } from "@/types/user.type";
import {
  getAccessTokenFromLocalStorage,
  getCustomerIdFromLocalStorage,
  getCustomerNameFromLocalStorage,
  getTableNumberFromLocalStorage,
  getUserFromLocalStorage,
} from "@/utils/auth";
import { createContext, useState } from "react";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
  productOrders: ProductOrder[];
  setProductOrders: React.Dispatch<React.SetStateAction<ProductOrder[]>>;
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  tableNumber: string;
  setTableNumber: React.Dispatch<React.SetStateAction<string>>;
  customerId: string;
  setCustomerId: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  resetUser: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  reset: () => null,
  productOrders: [],
  setProductOrders: () => null,
  customerName: getCustomerNameFromLocalStorage(),
  setCustomerName: () => null,
  tableNumber: getTableNumberFromLocalStorage(),
  setTableNumber: () => null,
  customerId: getCustomerIdFromLocalStorage(),
  setCustomerId: () => null,
  user: getUserFromLocalStorage(),
  setUser: () => null,
  resetUser: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [productOrders, setProductOrders] = useState<ProductOrder[]>(
    initialAppContext.productOrders ?? []
  );
  const [customerName, setCustomerName] = useState<string>(
    initialAppContext.customerName
  );
  const [tableNumber, setTableNumber] = useState<string>(
    initialAppContext.tableNumber
  );
  const [customerId, setCustomerId] = useState<string>(
    initialAppContext.customerId
  );
  const [user, setUser] = useState<User | null>(initialAppContext.user);

  const reset = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const resetUser = () => {
    setCustomerId("");
    setCustomerName("");
    setTableNumber("");
    localStorage.setItem("fd_customerId", "");
    localStorage.setItem("fd_customerName", "");
    localStorage.setItem("fd_tableNumber", "");
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        productOrders,
        setProductOrders,
        customerName,
        setCustomerName,
        tableNumber,
        setTableNumber,
        customerId,
        setCustomerId,
        reset,
        user,
        setUser,
        resetUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
