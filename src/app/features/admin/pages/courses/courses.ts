import { Component, signal, OnInit, computed, ViewChild, TemplateRef } from '@angular/core';
import { SearchAddBar } from '../../../../shared/components/search-add-bar/search-add-bar';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Course, CourseFormDto } from '../../../../shared/models/models';
import { CourseService } from '../../../../core/services/course.service';
import { ToastService } from '../../../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CourseForm } from '../../components/forms/courses/add-update-courses/course-form';
import { ModalDialog } from '../../../../shared/components/modal-dialog/modal-dialog';
import { Table, TableColumn } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-courses',
  imports: [SearchAddBar, CommonModule, Navbar, CourseForm, ModalDialog, Table, DateFormatPipe],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
  providers: [DateFormatPipe]
})

export class Courses implements OnInit {
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>
  @ViewChild(CourseForm) courseForm!: CourseForm;

  searchValue = signal('');
  allCourses = signal<Course[]>([]);
  loading = signal(false);
  dialogVisible = signal(false);
  dialogMode = signal<'add' | 'update'>('add');
  selectedCourse = signal<Course | null>(null);
  
  dialogTitle = computed(() =>
    this.dialogMode() === 'add' ? 'Add New Course' : `Update: ${this.selectedCourse()?.title || ''}`
  );

  selectedCourseForForm = computed<CourseFormDto | undefined>(() => {
    const course = this.selectedCourse();
    if (!course) {
      return undefined;
    }
    return {
      title: course.title,
      image: course.image,
      track: course.track.id,
      description: course.description
    };
  });

  get courseColumns(): TableColumn[]{
    return [
    {
      field: 'image',
      header: 'Course',
      isImage: true,
      showTitle: true
    },
    { field: 'track.name', header: 'Track' },
    {
      field: 'createdAt',
      header: 'Date Joined',
      bodyTemplate: this.dateTemplate
    
    },
  ];

  }
  

  filteredCourses = computed(() => {
    const filter = this.searchValue().toLowerCase();
    const courses = this.allCourses();

    if (!filter) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(filter) ||
        course.track.name.toLowerCase().includes(filter) ||
        this.dateFormatPipe.transform(course.createdAt).toLowerCase().includes(filter)

    );
  });

  constructor(
    private courseService: CourseService,
    private toastService: ToastService,
    private dateFormatPipe: DateFormatPipe
  ) { }


  ngOnInit() {
    this.loadCourses();
  }

  async loadCourses(): Promise<void> {
    this.loading.set(true);
    try {
      const courses = await firstValueFrom(this.courseService.getCourses());
      this.allCourses.set(courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      this.toastService.error('Failed to load courses');
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(value: string) {
    this.searchValue.set(value);

  }

  onAddCourse() {
    this.selectedCourse.set(null);
    this.dialogMode.set('add');
    this.dialogVisible.set(true);
  }

  onEditCourse(course: Course): void {
    this.selectedCourse.set(course)
    this.dialogMode.set('update');
    this.dialogVisible.set(true);
  }

  async onDeleteCourse(course: Course): Promise<void> {
    if (!confirm(`Are you sure you want to delete ? ${course.title}`)) return;
    try {
      await firstValueFrom(this.courseService.deleteCourse(course._id));
      this.allCourses.update(courses => courses.filter(c => c._id !== course._id));
      this.toastService.success('Course deleted successfully');
      this.loadCourses(); // Reload list
    } catch (error) {
      this.toastService.error('Failed to delete course');
      console.error('Delete error:', error);
    }
  }

  async onDialogSubmit(payload: { formData: FormData; courseData: CourseFormDto }): Promise<void> {
    this.loading.set(true);
    try {

      if (this.dialogMode() === 'add') {
        const newCourse = await firstValueFrom(this.courseService.addCourse(payload.formData));
        this.allCourses.update(courses => [...courses, newCourse]);
        this.toastService.success('Course added successfully');
        this.loadCourses()
        
      } else { // 'update' mode
        const courseId = this.selectedCourse()?._id;
        if (!courseId) {
          throw new Error('Course ID is missing for update operation.');
        }
        const updatedCourse = await firstValueFrom(
          this.courseService.updateCourse(courseId, payload.formData)
        );
        this.allCourses.update(courses =>
          courses.map(course => course.id === updatedCourse.id ? updatedCourse : course)
        );
        this.toastService.success('Course updated successfully');
        await this.loadCourses()
      }
    } catch (error) {
      this.toastService.error(`Failed to ${this.dialogMode()} course`);
      console.error('Submission error:', error);
    } finally {
      this.courseForm.stopLoading()
      this.dialogVisible.set(false);
      this.selectedCourse.set(null); 
    }

  }

  onDialogHide(): void {
    this.dialogVisible.set(false);
    this.selectedCourse.set(null);
  }

}
