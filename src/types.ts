import { ToBoolean, ToInteger, Transform } from './transformer';
import { IsBoolean, IsInt, IsNumber, IsString } from './validator';

export function Integer() {
  // eslint-disable-next-line
  return (target: any, propertyName: string) => {
    ToInteger()(target, propertyName);
    IsInt()(target, propertyName);
  };
}

export function Boolean() {
  // eslint-disable-next-line
  return (target: any, propertyName: string) => {
    ToBoolean()(target, propertyName);
    IsBoolean()(target, propertyName);
  };
}

export function Number() {
  // eslint-disable-next-line
  return (target: any, propertyName: string) => {
    Transform((value) => parseFloat(value))(target, propertyName);
    IsNumber()(target, propertyName);
  };
}

export function String(): (target, propertyName?: string) => void {
  return IsString();
}
