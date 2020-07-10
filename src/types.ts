import { ToBoolean, ToInteger, Transform } from './transformer';
import { IsBoolean, IsInt, IsNumber, IsString } from './validator';

export function Integer(): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    ToInteger()(target, propertyName);
    IsInt()(target, propertyName);
  };
}

export function Boolean(): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    ToBoolean()(target, propertyName);
    IsBoolean()(target, propertyName);
  };
}

export function Number(): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    Transform((value) => parseFloat(value))(target, propertyName);
    IsNumber()(target, propertyName);
  };
}

export function String(): PropertyDecorator {
  return IsString();
}
