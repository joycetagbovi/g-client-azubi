import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchAddBar } from './search-add-bar';

describe('SearchAddBar', () => {
    let component: SearchAddBar;
    let fixture: ComponentFixture<SearchAddBar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchAddBar]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchAddBar);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
}); 