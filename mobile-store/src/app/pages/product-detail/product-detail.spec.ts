import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductDetail } from './product-detail';
import { ProductService } from '../../services/product/productService';
import { CartService } from '../../services/cart/cartService';
import { ProductDetailModel } from '../../models/ProductDetailModel';

describe('ProductDetail', () => {

  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProduct: ProductDetailModel = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15',
    price: 999,
    imgUrl: 'assets/iphone15.png',
    cpu: 'A16',
    ram: '6GB',
    os: 'iOS',
    displayResolution: '1170x2532',
    battery: '3349 mAh',
    primaryCamera: ['48 Mpx', '12 Mpx'],
    dimentions: '147.6 x 71.6 x 7.8 mm',
    weight: 171,
    options: {
      colors: [
        { code: 1000, name: 'Black' }
      ],
      storages: [
        { code: 2000, name: '128 GB' }
      ]
    }
  } as unknown as ProductDetailModel;

  function setup(routeId: string | null = '1') {

    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => routeId
              }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
  }

  describe('carga inicial', () => {

    it('debe crear el componente', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('debe empezar con loading en true antes de resolver la petición', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));

      expect(component.loading()).toBeTrue();
    });

    it('debe poner loading a false y guardar el producto tras una carga correcta', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));
      fixture.detectChanges();

      expect(component.loading()).toBeFalse();
      expect(component.product()).toEqual(mockProduct);
    });

    it('debe preseleccionar el primer color y almacenamiento disponibles', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));
      fixture.detectChanges();

      expect(component.selectedColor()).toBe(1000);
      expect(component.selectedStorage()).toBe(2000);
    });

    it('no debe romper si el producto no tiene colores ni almacenamientos', () => {
      setup();
      const productSinOpciones: ProductDetailModel = {
        ...mockProduct,
        options: { colors: [], storages: [] }
      };
      productServiceSpy.getProduct.and.returnValue(of(productSinOpciones));

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(component.selectedColor()).toBeUndefined();
      expect(component.selectedStorage()).toBeUndefined();
    });

    it('debe poner loading a false si la petición falla', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(
        throwError(() => new Error('Error de red'))
      );
      fixture.detectChanges();

      expect(component.loading()).toBeFalse();
      expect(component.product()).toBeUndefined();
    });

    it('debe poner loading a false y no llamar al servicio si no hay id en la ruta', () => {
      setup(null);
      fixture.detectChanges();

      expect(component.loading()).toBeFalse();
      expect(productServiceSpy.getProduct).not.toHaveBeenCalled();
    });
  });

  describe('primaryCameraText', () => {

    it('debe unir el array de cámaras en un único texto', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));
      fixture.detectChanges();

      expect(component.primaryCameraText()).toBe('48 Mpx, 12 Mpx');
    });

    it('debe devolver el string tal cual si primaryCamera no es un array', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(
        of({ ...mockProduct, primaryCamera: '48 Mpx' } as any)
      );
      fixture.detectChanges();

      expect(component.primaryCameraText()).toBe('48 Mpx');
    });

    it('debe devolver "No disponible" si no hay dato de cámara', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(
        of({ ...mockProduct, primaryCamera: undefined } as any)
      );
      fixture.detectChanges();

      expect(component.primaryCameraText()).toBe('No disponible');
    });
  });

  describe('canAddToCart', () => {

    it('debe ser true cuando hay producto, precio, color y almacenamiento', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));
      fixture.detectChanges();

      expect(component.canAddToCart()).toBeTrue();
    });

    it('debe ser false si no hay precio', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(
        of({ ...mockProduct, price: undefined } as any)
      );
      fixture.detectChanges();

      expect(component.canAddToCart()).toBeFalse();
    });

    it('debe ser false si el color seleccionado es undefined', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(
        of({ ...mockProduct, options: { colors: [], storages: mockProduct.options.storages } })
      );
      fixture.detectChanges();

      expect(component.canAddToCart()).toBeFalse();
    });

    it('debe ser true aunque el código de color/almacenamiento sea 0', () => {
      setup();
      productServiceSpy.getProduct.and.returnValue(
        of({
          ...mockProduct,
          options: {
            colors: [{ code: 0, name: 'Negro' }],
            storages: [{ code: 0, name: '64 GB' }]
          }
        })
      );
      fixture.detectChanges();

      expect(component.canAddToCart()).toBeTrue();
    });
  });

  describe('addToCart / confirmAddToCart', () => {

    beforeEach(() => {
      setup();
      productServiceSpy.getProduct.and.returnValue(of(mockProduct));
      fixture.detectChanges();
    });

    it('no debe abrir el diálogo si no se puede añadir al carrito', () => {
      component.selectedColor.set(undefined);

      component.addToCart();

      expect(component.showConfirmDialog()).toBeFalse();
    });

    it('debe abrir el diálogo de confirmación si se puede añadir', () => {
      component.addToCart();

      expect(component.showConfirmDialog()).toBeTrue();
      expect(cartServiceSpy.addToCart).not.toHaveBeenCalled();
    });

    it('cancelAddToCart debe cerrar el diálogo sin llamar al servicio', () => {
      component.addToCart();
      component.cancelAddToCart();

      expect(component.showConfirmDialog()).toBeFalse();
      expect(cartServiceSpy.addToCart).not.toHaveBeenCalled();
    });

    it('confirmAddToCart debe llamar al servicio con el id, color y almacenamiento correctos', () => {
      cartServiceSpy.addToCart.and.returnValue(of({}));

      component.addToCart();
      component.confirmAddToCart();

      expect(cartServiceSpy.addToCart).toHaveBeenCalledWith({
        id: mockProduct.id,
        colorCode: 1000,
        storageCode: 2000
      });
    });

    it('confirmAddToCart debe cerrar el diálogo y quitar el estado de carga tras éxito', () => {
      cartServiceSpy.addToCart.and.returnValue(of({}));

      component.addToCart();
      component.confirmAddToCart();

      expect(component.showConfirmDialog()).toBeFalse();
      expect(component.addingToCart()).toBeFalse();
    });

    it('debe manejar el error del servicio sin dejar addingToCart bloqueado', () => {
      cartServiceSpy.addToCart.and.returnValue(
        throwError(() => new Error('Error al añadir'))
      );

      component.addToCart();
      component.confirmAddToCart();

      expect(component.addingToCart()).toBeFalse();
    });
  });
});