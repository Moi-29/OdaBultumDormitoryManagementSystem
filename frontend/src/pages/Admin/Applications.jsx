import { useState, useEffect } from 'react';
import { ClipboardList, Eye, X, User, GraduationCap, Home, Users, Search, Filter, Download, Trash2, CheckCircle2, Calendar, Phone, Mail, MapPin, Award, BookOpen, Building, FileText, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/useNotification';
import jsPDF from 'jspdf';

const Applications = () => {
    const { confirmDialog, showConfirm } = useConfirmDialog();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Export filter modal state
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState(null); // 'pdf' or 'csv'
    const [exportFilters, setExportFilters] = useState({
        filterType: 'all', // 'all', 'batch', 'department', 'studentId', 'combined'
        batch: '',
        department: '',
        studentId: ''
    });

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Try to fetch from API
            try {
                const response = await axios.get(`${API_URL}/api/applications`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    setApplications(response.data);
                    setLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log('API not available, using mock data:', apiError.message);
            }
            
            // Fallback to mock data if API fails or returns empty
            const mockData = [
                {
                    _id: '1',
                    studentId: 'RU/1270/18',
                    studentName: 'Abebech Kebede',
                    submittedOn: '2024-05-10',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Abebech Kebede Alemu',
                        idNo: 'RU/1270/18',
                        sex: 'Female',
                        mealCardNo: 'MC12345',
                        college: 'Natural Sciences',
                        department: 'Biology',
                        academicYear: '3rd Year',
                        dormNo: 'B-205',
                        phone: '+251911234567',
                        religious: 'Orthodox',
                        nation: 'Ethiopian'
                    },
                    educationalInfo: {
                        stream: 'Natural Science',
                        sponsorCategory: 'Government',
                        nationalExamYear: '2015',
                        entryYear: '2016',
                        sponsoredBy: 'Family',
                        examinationId: 'D1729733',
                        admissionDate: '12/14/2023 12:00 AM',
                        checkedInDate: '01/15/2024',
                        nationalExamResult: '454'
                    },
                    schoolInfo: {
                        schoolName: 'Abdi Gudina Primary School',
                        region: 'Oromia',
                        city: 'Tulu Bolo',
                        zone: 'West Shewa',
                        schoolType: 'Public',
                        woreda: 'BECHO(SHOA SOUTH WEST)',
                        attendedYearFrom: '2004',
                        attendedYearTo: '2011'
                    },
                    familyInfo: {
                        nationality: 'Ethiopia',
                        region: 'Oromia',
                        zone: 'West Shewa',
                        woreda: 'Becho',
                        kebele: 'Areda',
                        motherName: 'Almaz Tesfaye',
                        familyPhone: '+251922334455'
                    },
                    emergencyInfo: {
                        fullName: 'Kebede Alemu',
                        relationship: 'Father',
                        job: 'Farmer',
                        homeTown: 'Tulu Bolo'
                    }
                },
                {
                    _id: '2',
                    studentId: 'RU/1271/18',
                    studentName: 'Addis Ketema',
                    submittedOn: '2024-05-09',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Addis Ketema Bekele',
                        idNo: 'RU/1271/18',
                        sex: 'Male',
                        mealCardNo: 'MC12346',
                        college: 'Engineering',
                        department: 'Computer Science',
                        academicYear: '2nd Year',
                        dormNo: 'A-101',
                        phone: '+251922345678',
                        religious: 'Protestant',
                        nation: 'Ethiopian'
                    },
                    educationalInfo: {
                        stream: 'Natural Science',
                        sponsorCategory: 'Government',
                        nationalExamYear: '2016',
                        entryYear: '2017',
                        sponsoredBy: 'Government',
                        examinationId: 'D1729734',
                        admissionDate: '12/15/2023 10:00 AM',
                        checkedInDate: '01/16/2024',
                        nationalExamResult: '478'
                    },
                    schoolInfo: {
                        schoolName: 'Addis Ketema Secondary School',
                        region: 'Addis Ababa',
                        city: 'Addis Ababa',
                        zone: 'Addis Ketema',
                        schoolType: 'Public',
                        woreda: 'Addis Ketema',
                        attendedYearFrom: '2005',
                        attendedYearTo: '2012'
                    },
                    familyInfo: {
                        nationality: 'Ethiopia',
                        region: 'Addis Ababa',
                        zone: 'Addis Ketema',
                        woreda: 'Addis Ketema',
                        kebele: '05',
                        motherName: 'Tigist Haile',
                        familyPhone: '+251933445566'
                    },
                    emergencyInfo: {
                        fullName: 'Ketema Bekele',
                        relationship: 'Father',
                        job: 'Teacher',
                        homeTown: 'Addis Ababa'
                    }
                }
            ];
            setApplications(mockData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };

    const toggleEditPermission = async (applicationId, event) => {
        // Prevent any default behavior or event bubbling
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        try {
            const token = localStorage.getItem('token');
            
            // Try to call the API
            try {
                const response = await axios.patch(
                    `${API_URL}/api/applications/${applicationId}/edit-permission`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                // Update local state with response data
                setApplications(applications.map(app => 
                    app._id === applicationId ? { ...app, canEdit: !app.canEdit } : app
                ));
                
                // Show success notification
                const updatedApp = applications.find(app => app._id === applicationId);
                const newStatus = !updatedApp.canEdit;
                showNotification(
                    `Edit permission ${newStatus ? 'enabled' : 'disabled'} for ${updatedApp.studentName}`,
                    'success'
                );
            } catch (apiError) {
                console.error('API Error:', apiError);
                console.error('Error response:', apiError.response?.data);
                console.error('Error status:', apiError.response?.status);
                
                // If backend not deployed yet (404 or 500), still update UI for testing
                if (apiError.response?.status === 404 || apiError.response?.status === 500) {
                    console.log('Backend not deployed yet, updating UI locally for testing');
                    
                    // Update local state anyway
                    setApplications(applications.map(app => 
                        app._id === applicationId ? { ...app, canEdit: !app.canEdit } : app
                    ));
                    
                    // Show warning notification
                    const updatedApp = applications.find(app => app._id === applicationId);
                    const newStatus = !updatedApp.canEdit;
                    showNotification(
                        `Edit permission ${newStatus ? 'enabled' : 'disabled'} locally (Backend not deployed yet - changes won't persist)`,
                        'success'
                    );
                } else {
                    throw apiError; // Re-throw other errors
                }
            }
        } catch (error) {
            console.error('Error toggling edit permission:', error);
            showNotification(
                'Failed to toggle edit permission. Backend may not be deployed yet. Please deploy backend to Render.',
                'error'
            );
        }
    };

    const deleteSelectedApplications = async () => {
        if (selectedIds.length === 0) return;
        
        const confirmed = await showConfirm({
            title: 'Delete Applications',
            message: `Are you sure you want to delete ${selectedIds.length} application(s)? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            
            // Try API call first
            try {
                const response = await axios.delete(`${API_URL}/api/applications/bulk`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: { applicationIds: selectedIds }
                });

                // Remove from local state
                setApplications(applications.filter(app => !selectedIds.includes(app._id)));
                setSelectedIds([]);
                setSelectMode(false);
                
                showNotification(response.data.message || `Successfully deleted ${selectedIds.length} application(s)`, 'success');
            } catch (apiError) {
                // If API fails (404 or 500), just remove from local state (for mock data)
                console.log('API not available, removing from local state:', apiError.message);
                
                // Remove from local state
                setApplications(applications.filter(app => !selectedIds.includes(app._id)));
                setSelectedIds([]);
                setSelectMode(false);
                
                showNotification(`Successfully deleted ${selectedIds.length} application(s) from local view`, 'success');
            }
        } catch (error) {
            console.error('Error deleting applications:', error);
            showNotification('Failed to delete applications. Please try again.', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return '#10b981';
            case 'Pending': return '#f59e0b';
            case 'Rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    const viewDetails = (application) => {
        setSelectedApplication(application);
        setShowDetailsModal(true);
    };

    // Get unique batches and departments from applications
    const getUniqueBatches = () => {
        const batches = applications
            .map(app => app.personalInfo?.academicYear)
            .filter(Boolean);
        return [...new Set(batches)].sort();
    };

    const getUniqueDepartments = () => {
        const departments = applications
            .map(app => app.personalInfo?.department)
            .filter(Boolean);
        return [...new Set(departments)].sort();
    };

    // Filter applications based on export criteria
    const getFilteredApplications = () => {
        let filtered = [...applications];

        if (exportFilters.filterType === 'all') {
            return filtered;
        }

        if (exportFilters.filterType === 'studentId' && exportFilters.studentId) {
            const searchId = exportFilters.studentId.trim().toLowerCase();
            filtered = filtered.filter(app => 
                app.studentId?.toLowerCase().includes(searchId) ||
                app.personalInfo?.idNo?.toLowerCase().includes(searchId)
            );
        } else if (exportFilters.filterType === 'batch' && exportFilters.batch) {
            filtered = filtered.filter(app => 
                app.personalInfo?.academicYear === exportFilters.batch
            );
        } else if (exportFilters.filterType === 'department' && exportFilters.department) {
            filtered = filtered.filter(app => 
                app.personalInfo?.department === exportFilters.department
            );
        } else if (exportFilters.filterType === 'combined') {
            if (exportFilters.batch) {
                filtered = filtered.filter(app => 
                    app.personalInfo?.academicYear === exportFilters.batch
                );
            }
            if (exportFilters.department) {
                filtered = filtered.filter(app => 
                    app.personalInfo?.department === exportFilters.department
                );
            }
        }

        return filtered;
    };

    // Open export modal
    const openExportModal = (type) => {
        setExportType(type);
        setShowExportModal(true);
        // Reset filters
        setExportFilters({
            filterType: 'all',
            batch: '',
            department: '',
            studentId: ''
        });
    };

    // Handle export with filters
    const handleExportWithFilters = async () => {
        const filteredApps = getFilteredApplications();

        if (filteredApps.length === 0) {
            showNotification('No applications match the selected filters', 'error');
            return;
        }

        setShowExportModal(false);

        if (exportType === 'pdf') {
            await exportToPDFFiltered(filteredApps);
        } else if (exportType === 'csv') {
            exportToCSVFiltered(filteredApps);
        }
    };

    // Export to PDF - One full page per student with all tabs (matching official design)
    const exportToPDFFiltered = async (appsToExport) => {
        try {
            showNotification('Generating PDF...', 'info');
            
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Colors matching the design
            const darkBlue = [30, 41, 59]; // #1e293b
            const gold = [234, 179, 8]; // #eab308
            const lightGray = [243, 244, 246]; // #f3f4f6
            
            // University logo URL
            const logoUrl = 'https://www.developmentaid.org/files/organizationLogos/oda-bultum-university-468233.jpg';
            
            // Pre-load logo once for all pages
            let logoImage = null;
            try {
                logoImage = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        console.log('✓ University logo loaded successfully');
                        resolve(img);
                    };
                    img.onerror = (err) => {
                        console.warn('⚠ Logo loading failed:', err);
                        reject(err);
                    };
                    img.src = logoUrl;
                    setTimeout(() => reject(new Error('Logo load timeout')), 5000);
                });
            } catch (error) {
                console.warn('Logo unavailable, continuing without it');
            }
            
            for (let i = 0; i < appsToExport.length; i++) {
                const app = appsToExport[i];
                
                if (i > 0) {
                    doc.addPage();
                }
                
                // LEFT SIDEBAR - Dark Blue
                const sidebarWidth = 60;
                doc.setFillColor(...darkBlue);
                doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
                
                // Logo in sidebar
                if (logoImage) {
                    try {
                        const logoSize = 35;
                        const logoX = (sidebarWidth - logoSize) / 2;
                        doc.addImage(logoImage, 'JPEG', logoX, 20, logoSize, logoSize);
                    } catch (error) {
                        console.warn('Error adding logo');
                    }
                }
                
                // ID NO in sidebar
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text('ID NO:', sidebarWidth / 2, 70, { align: 'center' });
                doc.setFontSize(11);
                doc.text(app.personalInfo?.idNo || app.studentId || '-', sidebarWidth / 2, 76, { align: 'center' });
                
                // STATUS badge in sidebar
                const badgeY = 85;
                doc.setFillColor(...gold);
                doc.roundedRect(10, badgeY, sidebarWidth - 20, 10, 3, 3, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('STATUS: ACTIVE', sidebarWidth / 2, badgeY + 7, { align: 'center' });
                
                // MAIN CONTENT AREA
                const contentX = sidebarWidth + 10;
                const contentWidth = pageWidth - sidebarWidth - 15;
                let yPos = 15;
                
                // Header: ODA BULTUM UNIVERSITY
                doc.setTextColor(100, 116, 139);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('ODA BULTUM UNIVERSITY', contentX, yPos);
                yPos += 10;
                
                // Student Record Header
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text(`STUDENT RECORD: ${app.personalInfo?.idNo || app.studentId || '-'}`, contentX, yPos);
                yPos += 12;
                
                // Student Name
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text((app.personalInfo?.fullName || app.studentName || '-').toUpperCase(), contentX, yPos);
                
                // Sponsor badge next to name
                const nameWidth = doc.getTextWidth((app.personalInfo?.fullName || app.studentName || '-').toUpperCase());
                doc.setFillColor(...gold);
                doc.roundedRect(contentX + nameWidth + 5, yPos - 5, 35, 8, 2, 2, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.text(app.educationalInfo?.sponsorCategory?.toUpperCase() || 'SELF-SPONSORED', contentX + nameWidth + 22.5, yPos - 0.5, { align: 'center' });
                yPos += 15;
                
                // PERSONAL INFORMATION Section
                doc.setFillColor(...lightGray);
                doc.roundedRect(contentX, yPos, contentWidth, 8, 2, 2, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('PERSONAL INFORMATION', contentX + 3, yPos + 5.5);
                yPos += 12;
                
                // Personal info fields - ALL FIELDS
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60, 60, 60);
                
                const personalFields = [
                    ['FULL NAME:', app.personalInfo?.fullName || '-'],
                    ['ID NO:', app.personalInfo?.idNo || '-'],
                    ['SEX:', app.personalInfo?.sex || '-'],
                    ['MEAL CARD NO:', app.personalInfo?.mealCardNo || '-'],
                    ['COLLEGE:', app.personalInfo?.college || '-'],
                    ['DEPARTMENT:', app.personalInfo?.department || '-'],
                    ['ACADEMIC YEAR:', app.personalInfo?.academicYear || '-'],
                    ['DORM NO:', app.personalInfo?.dormNo || '-'],
                    ['PHONE:', app.personalInfo?.phone || '-'],
                    ['RELIGIOUS:', app.personalInfo?.religious || '-'],
                    ['NATION:', app.personalInfo?.nation || '-']
                ];
                
                personalFields.forEach(([label, value]) => {
                    doc.setFont('helvetica', 'bold');
                    doc.text(label, contentX, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.text(value, contentX + 40, yPos);
                    yPos += 5;
                });
                
                yPos += 3;
                
                // EDUCATIONAL INFORMATION Section
                if (app.educationalInfo) {
                    doc.setFillColor(...lightGray);
                    doc.roundedRect(contentX, yPos, contentWidth, 8, 2, 2, 'F');
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.text('EDUCATIONAL INFORMATION', contentX + 3, yPos + 5.5);
                    yPos += 12;
                    
                    doc.setFontSize(8);
                    const educationalFields = [
                        ['STREAM:', app.educationalInfo.stream || '-'],
                        ['SPONSOR CATEGORY:', app.educationalInfo.sponsorCategory || '-'],
                        ['NATIONAL EXAM YEAR:', app.educationalInfo.nationalExamYear || '-'],
                        ['ENTRY YEAR:', app.educationalInfo.entryYear || '-'],
                        ['SPONSORED BY:', app.educationalInfo.sponsoredBy || '-'],
                        ['EXAMINATION ID:', app.educationalInfo.examinationId || '-'],
                        ['ADMISSION DATE:', app.educationalInfo.admissionDate || '-'],
                        ['CHECKED-IN DATE:', app.educationalInfo.checkedInDate || '-'],
                        ['NATIONAL EXAM RESULT:', app.educationalInfo.nationalExamResult || '-']
                    ];
                    
                    educationalFields.forEach(([label, value]) => {
                        doc.setFont('helvetica', 'bold');
                        doc.text(label, contentX, yPos);
                        doc.setFont('helvetica', 'normal');
                        doc.text(value, contentX + 50, yPos);
                        yPos += 5;
                    });
                    
                    yPos += 3;
                }
                
                // SCHOOL INFORMATION Section
                if (app.schoolInfo) {
                    doc.setFillColor(...lightGray);
                    doc.roundedRect(contentX, yPos, contentWidth, 8, 2, 2, 'F');
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.text('SCHOOL INFORMATION', contentX + 3, yPos + 5.5);
                    yPos += 12;
                    
                    doc.setFontSize(8);
                    const schoolFields = [
                        ['SCHOOL NAME:', app.schoolInfo.schoolName || '-'],
                        ['REGION:', app.schoolInfo.region || '-'],
                        ['CITY:', app.schoolInfo.city || '-'],
                        ['ZONE:', app.schoolInfo.zone || '-'],
                        ['SCHOOL TYPE:', app.schoolInfo.schoolType || '-'],
                        ['WOREDA:', app.schoolInfo.woreda || '-'],
                        ['ATTENDED YEAR FROM:', app.schoolInfo.attendedYearFrom || '-'],
                        ['ATTENDED YEAR TO:', app.schoolInfo.attendedYearTo || '-']
                    ];
                    
                    schoolFields.forEach(([label, value]) => {
                        doc.setFont('helvetica', 'bold');
                        doc.text(label, contentX, yPos);
                        doc.setFont('helvetica', 'normal');
                        doc.text(value, contentX + 45, yPos);
                        yPos += 5;
                    });
                    
                    yPos += 3;
                }
                
                // FAMILY INFORMATION Section
                if (app.familyInfo) {
                    doc.setFillColor(...lightGray);
                    doc.roundedRect(contentX, yPos, contentWidth, 8, 2, 2, 'F');
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.text('FAMILY INFORMATION', contentX + 3, yPos + 5.5);
                    yPos += 12;
                    
                    doc.setFontSize(8);
                    const familyFields = [
                        ['NATIONALITY:', app.familyInfo.nationality || '-'],
                        ['REGION:', app.familyInfo.region || '-'],
                        ['ZONE:', app.familyInfo.zone || '-'],
                        ['WOREDA:', app.familyInfo.woreda || '-'],
                        ['KEBELE:', app.familyInfo.kebele || '-'],
                        ['MOTHER NAME:', app.familyInfo.motherName || '-'],
                        ['FAMILY PHONE:', app.familyInfo.familyPhone || '-']
                    ];
                    
                    familyFields.forEach(([label, value]) => {
                        doc.setFont('helvetica', 'bold');
                        doc.text(label, contentX, yPos);
                        doc.setFont('helvetica', 'normal');
                        doc.text(value, contentX + 40, yPos);
                        yPos += 5;
                    });
                }
                
                // FOOTER - Gold line and text
                const footerY = pageHeight - 15;
                doc.setDrawColor(...gold);
                doc.setLineWidth(1);
                doc.line(contentX, footerY, pageWidth - 5, footerY);
                
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text(`PAGE ${i + 1} OF ${appsToExport.length}`, contentX, footerY + 5);
                doc.text('VERIFIED OFFICIAL DOCUMENT', pageWidth - 5, footerY + 5, { align: 'right' });
            }
            
            // Save the PDF
            doc.save(`Applications_${new Date().toISOString().split('T')[0]}.pdf`);
            showNotification(`Successfully exported ${appsToExport.length} application(s) to PDF`, 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF. Please try again.', 'error');
        }
    };

    // Export to CSV - Complete structured dataset
    const exportToCSVFiltered = (appsToExport) => {
        try {
            showNotification('Generating CSV...', 'info');
            
            // Define CSV headers with clear naming convention
            const headers = [
                // Personal Information
                'personal_fullName',
                'personal_idNo',
                'personal_sex',
                'personal_mealCardNo',
                'personal_college',
                'personal_department',
                'personal_academicYear',
                'personal_dormNo',
                'personal_phone',
                'personal_religious',
                'personal_nation',
                // Educational Information
                'education_stream',
                'education_sponsorCategory',
                'education_nationalExamYear',
                'education_entryYear',
                'education_sponsoredBy',
                'education_examinationId',
                'education_admissionDate',
                'education_checkedInDate',
                'education_nationalExamResult',
                // School Information
                'school_schoolName',
                'school_region',
                'school_city',
                'school_zone',
                'school_schoolType',
                'school_woreda',
                'school_attendedYearFrom',
                'school_attendedYearTo',
                // Family Information
                'family_nationality',
                'family_region',
                'family_zone',
                'family_woreda',
                'family_kebele',
                'family_motherName',
                'family_familyPhone',
                // Metadata
                'submittedOn',
                'canEdit'
            ];
            
            // Build CSV rows
            const rows = appsToExport.map(app => {
                return [
                    // Personal Information
                    app.personalInfo?.fullName || '',
                    app.personalInfo?.idNo || '',
                    app.personalInfo?.sex || '',
                    app.personalInfo?.mealCardNo || '',
                    app.personalInfo?.college || '',
                    app.personalInfo?.department || '',
                    app.personalInfo?.academicYear || '',
                    app.personalInfo?.dormNo || '',
                    app.personalInfo?.phone || '',
                    app.personalInfo?.religious || '',
                    app.personalInfo?.nation || '',
                    // Educational Information
                    app.educationalInfo?.stream || '',
                    app.educationalInfo?.sponsorCategory || '',
                    app.educationalInfo?.nationalExamYear || '',
                    app.educationalInfo?.entryYear || '',
                    app.educationalInfo?.sponsoredBy || '',
                    app.educationalInfo?.examinationId || '',
                    app.educationalInfo?.admissionDate || '',
                    app.educationalInfo?.checkedInDate || '',
                    app.educationalInfo?.nationalExamResult || '',
                    // School Information
                    app.schoolInfo?.schoolName || '',
                    app.schoolInfo?.region || '',
                    app.schoolInfo?.city || '',
                    app.schoolInfo?.zone || '',
                    app.schoolInfo?.schoolType || '',
                    app.schoolInfo?.woreda || '',
                    app.schoolInfo?.attendedYearFrom || '',
                    app.schoolInfo?.attendedYearTo || '',
                    // Family Information
                    app.familyInfo?.nationality || '',
                    app.familyInfo?.region || '',
                    app.familyInfo?.zone || '',
                    app.familyInfo?.woreda || '',
                    app.familyInfo?.kebele || '',
                    app.familyInfo?.motherName || '',
                    app.familyInfo?.familyPhone || '',
                    // Metadata
                    app.submittedOn || '',
                    app.canEdit ? 'Yes' : 'No'
                ];
            });
            
            // Escape CSV values (handle commas, quotes, newlines)
            const escapeCSV = (value) => {
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            };
            
            // Build CSV content
            let csvContent = headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.map(escapeCSV).join(',') + '\n';
            });
            
            // Create and download CSV file
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `Applications_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification(`Successfully exported ${appsToExport.length} application(s) to CSV`, 'success');
        } catch (error) {
            console.error('Error generating CSV:', error);
            showNotification('Failed to generate CSV. Please try again.', 'error');
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Premium Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '320px',
                    maxWidth: '500px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        {notification.type === 'success' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ 
                            fontWeight: 700, 
                            fontSize: '1rem', 
                            marginBottom: '0.25rem',
                            letterSpacing: '-0.2px'
                        }}>
                            {notification.type === 'success' ? 'Success!' : 'Error'}
                        </div>
                        <div style={{ 
                            fontSize: '0.9rem', 
                            opacity: 0.95,
                            lineHeight: '1.4'
                        }}>
                            {notification.message}
                        </div>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            
            {/* Confirm Dialog */}
            {confirmDialog && (
                <ConfirmDialog {...confirmDialog} />
            )}
            
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <ClipboardList size={32} /> Applications
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Manage student dormitory applications
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {/* Export Buttons */}
                        <button
                            onClick={() => openExportModal('pdf')}
                            disabled={applications.length === 0}
                            type="button"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: applications.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: applications.length === 0 ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s',
                                opacity: applications.length === 0 ? 0.6 : 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: applications.length > 0 ? '0 4px 6px -1px rgba(139, 92, 246, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (applications.length > 0) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(139, 92, 246, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (applications.length > 0) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.3)';
                                }
                            }}
                        >
                            <FileText size={18} />
                            Export to PDF
                        </button>
                        <button
                            onClick={() => openExportModal('csv')}
                            disabled={applications.length === 0}
                            type="button"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: applications.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: applications.length === 0 ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s',
                                opacity: applications.length === 0 ? 0.6 : 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: applications.length > 0 ? '0 4px 6px -1px rgba(16, 185, 129, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (applications.length > 0) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(16, 185, 129, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (applications.length > 0) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)';
                                }
                            }}
                        >
                            <Download size={18} />
                            Export to CSV
                        </button>
                        
                        {/* Select and Delete Buttons */}
                        <button
                            onClick={() => {
                                setSelectMode(!selectMode);
                                if (selectMode) {
                                    setSelectedIds([]);
                                }
                            }}
                            type="button"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectMode ? '#10b981' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {selectMode ? 'Done' : 'Select'}
                        </button>
                        {selectMode && (
                            <button
                                onClick={deleteSelectedApplications}
                                disabled={selectedIds.length === 0}
                                type="button"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: selectedIds.length === 0 ? '#9ca3af' : '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    opacity: selectedIds.length === 0 ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedIds.length > 0) {
                                        e.currentTarget.style.background = '#dc2626';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedIds.length > 0) {
                                        e.currentTarget.style.background = '#ef4444';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                Delete ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    {selectMode && (
                                        <input 
                                            type="checkbox" 
                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                            checked={selectedIds.length === applications.length && applications.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(applications.map(app => app._id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    )}
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Student Name
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Submitted On
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} style={{ 
                                    borderBottom: '1px solid #e2e8f0',
                                    background: selectedIds.includes(app._id) ? '#f0fdf4' : 'transparent'
                                }}>
                                    <td style={{ padding: '1rem' }}>
                                        {selectMode && (
                                            <input 
                                                type="checkbox" 
                                                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                checked={selectedIds.includes(app._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds([...selectedIds, app._id]);
                                                    } else {
                                                        setSelectedIds(selectedIds.filter(id => id !== app._id));
                                                    }
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                                        {app.studentName}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {app.submittedOn}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => viewDetails(app)}
                                            type="button"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {applications.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <ClipboardList size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No applications submitted yet</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '24px',
                        maxWidth: '950px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            color: 'white',
                            padding: '2rem 2.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-10%',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                borderRadius: '50%'
                            }}></div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h2 style={{ 
                                    margin: 0, 
                                    fontSize: '1.75rem', 
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    Application Details
                                </h2>
                                <p style={{ 
                                    margin: '0.5rem 0 0 0', 
                                    fontSize: '0.9rem', 
                                    opacity: 0.95,
                                    fontWeight: 400
                                }}>
                                    {selectedApplication.studentName} • {selectedApplication.personalInfo.idNo}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
                                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                }}
                            >
                                <X size={22} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            padding: '1.5rem 2.5rem 0 2.5rem',
                            background: 'linear-gradient(to bottom, #fafbfc 0%, #ffffff 100%)',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            {[
                                { id: 'personal', label: 'Personal', icon: <User size={18} />, color: '#10b981' },
                                { id: 'educational', label: 'Educational', icon: <GraduationCap size={18} />, color: '#3b82f6' },
                                { id: 'school', label: 'School', icon: <Home size={18} />, color: '#f59e0b' },
                                { id: 'family', label: 'Family', icon: <Users size={18} />, color: '#8b5cf6' },
                                { id: 'emergency', label: 'Emergency', icon: <AlertTriangle size={18} />, color: '#ef4444' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '1rem 1.75rem',
                                        border: 'none',
                                        background: activeTab === tab.id 
                                            ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`
                                            : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 700 : 500,
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderRadius: '12px 12px 0 0',
                                        position: 'relative',
                                        transform: activeTab === tab.id ? 'translateY(1px)' : 'translateY(0)',
                                        boxShadow: activeTab === tab.id 
                                            ? `0 -4px 12px -2px ${tab.color}40`
                                            : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.background = '#f1f5f9';
                                            e.currentTarget.style.color = '#1e293b';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#64748b';
                                        }
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Content */}
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            padding: '2.5rem',
                            background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)'
                        }}>
                            {/* Personal Tab - Matching Student Form Structure */}
                            {activeTab === 'personal' && selectedApplication.personalInfo && (
                                <div>
                                    {/* Basic Information Section */}
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <User size={20} />
                                            Basic Information
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="Name" value={selectedApplication.personalInfo.name} />
                                            <FormField label="Father Name" value={selectedApplication.personalInfo.fatherName} />
                                            <FormField label="G.Father Name" value={selectedApplication.personalInfo.gFatherName} />
                                            <FormField label="Religious" value={selectedApplication.personalInfo.religion} />
                                            <FormField label="Gender" value={selectedApplication.personalInfo.gender} />
                                            <FormField label="Date of Birth" value={selectedApplication.personalInfo.dob} />
                                            <FormField label="Place of Birth" value={selectedApplication.personalInfo.placeOfBirth} />
                                            <FormField label="Mother Tongue" value={selectedApplication.personalInfo.motherTongue} />
                                            <FormField label="National ID" value={selectedApplication.personalInfo.nationalId} />
                                            <FormField label="Health Status" value={selectedApplication.personalInfo.healthStatus} />
                                            <FormField label="Marital Status" value={selectedApplication.personalInfo.maritalStatus} />
                                        </div>
                                    </div>

                                    {/* Location & Address Section */}
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            📍 Location & Address
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="Citizenship" value={selectedApplication.personalInfo.citizenship} />
                                            <FormField label="Country" value={selectedApplication.personalInfo.country} />
                                            <FormField label="Woreda" value={selectedApplication.personalInfo.woreda} />
                                            <FormField label="City (En)" value={selectedApplication.personalInfo.cityEn} />
                                            <FormField label="Kebele (En)" value={selectedApplication.personalInfo.kebeleEn} />
                                            <FormField label="Phone" value={selectedApplication.personalInfo.phone} />
                                            <FormField label="Email" value={selectedApplication.personalInfo.email} />
                                            <FormField label="P.O. Box" value={selectedApplication.personalInfo.poBox} />
                                        </div>
                                    </div>

                                    {/* Others Section */}
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            ••• Others
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="Economical Status" value={selectedApplication.personalInfo.economicalStatus} />
                                            <FormField label="Area Type" value={selectedApplication.personalInfo.areaType} />
                                            <FormField label="TIN Number" value={selectedApplication.personalInfo.tinNumber} />
                                            <FormField label="Account Number" value={selectedApplication.personalInfo.accountNumber} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Educational Tab */}
                            {activeTab === 'educational' && selectedApplication.educationalInfo && (
                                <div>
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <GraduationCap size={20} />
                                            Campus Related Information
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="Stream" value={selectedApplication.educationalInfo.stream} />
                                            <FormField label="Sponsor Category" value={selectedApplication.educationalInfo.sponsorCategory} />
                                            <FormField label="National Exam Year" value={selectedApplication.educationalInfo.nationalExamYear} />
                                            <FormField label="Entry Year" value={selectedApplication.educationalInfo.entryYear} />
                                            <FormField label="Sponsored By" value={selectedApplication.educationalInfo.sponsoredBy} />
                                            <FormField label="Examination ID" value={selectedApplication.educationalInfo.examinationId} />
                                            <FormField label="Admission Date" value={selectedApplication.educationalInfo.admissionDate} />
                                            <FormField label="Checked-In Date" value={selectedApplication.educationalInfo.checkedInDate} />
                                            <FormField label="National Exam Result" value={selectedApplication.educationalInfo.nationalExamResult} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* School Tab - Three Sections */}
                            {activeTab === 'school' && selectedApplication.schoolInfo && (
                                <div>
                                    {/* Primary School */}
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Home size={20} />
                                            Primary School
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="School Name" value={selectedApplication.schoolInfo.primary?.schoolName} />
                                            <FormField label="Woreda" value={selectedApplication.schoolInfo.primary?.woreda} />
                                            <FormField label="School Type" value={selectedApplication.schoolInfo.primary?.schoolType} />
                                            <div>
                                                <label style={{ 
                                                    display: 'block', 
                                                    marginBottom: '0.75rem', 
                                                    fontWeight: 600, 
                                                    color: '#1e293b', 
                                                    fontSize: '0.875rem'
                                                }}>
                                                    Attended Year (From - To)
                                                </label>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        value={selectedApplication.schoolInfo.primary?.attendedYearFrom || ''}
                                                        readOnly
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem',
                                                            border: '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            background: '#f3f4f6',
                                                            color: '#111827',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={selectedApplication.schoolInfo.primary?.attendedYearTo || ''}
                                                        readOnly
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem',
                                                            border: '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            background: '#f3f4f6',
                                                            color: '#111827',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary School */}
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Home size={20} />
                                            Secondary School
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="School Name" value={selectedApplication.schoolInfo.secondary?.schoolName} />
                                            <FormField label="Woreda" value={selectedApplication.schoolInfo.secondary?.woreda} />
                                            <FormField label="School Type" value={selectedApplication.schoolInfo.secondary?.schoolType} />
                                            <div>
                                                <label style={{ 
                                                    display: 'block', 
                                                    marginBottom: '0.75rem', 
                                                    fontWeight: 600, 
                                                    color: '#1e293b', 
                                                    fontSize: '0.875rem'
                                                }}>
                                                    Attended Year (From - To)
                                                </label>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        value={selectedApplication.schoolInfo.secondary?.attendedYearFrom || ''}
                                                        readOnly
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem',
                                                            border: '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            background: '#f3f4f6',
                                                            color: '#111827',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={selectedApplication.schoolInfo.secondary?.attendedYearTo || ''}
                                                        readOnly
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem',
                                                            border: '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            background: '#f3f4f6',
                                                            color: '#111827',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* Family Tab */}
                            {activeTab === 'family' && selectedApplication.familyInfo && (
                                <div>
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Users size={20} />
                                            Birth Place & Family Information
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="Nationality" value={selectedApplication.familyInfo.nationality} />
                                            <FormField label="Region" value={selectedApplication.familyInfo.region} />
                                            <FormField label="Zone" value={selectedApplication.familyInfo.zone} />
                                            <FormField label="Woreda" value={selectedApplication.familyInfo.woreda} />
                                            <FormField label="Kebele" value={selectedApplication.familyInfo.kebele} />
                                            <FormField label="Mother Name" value={selectedApplication.familyInfo.motherName} />
                                            <FormField label="Family Phone" value={selectedApplication.familyInfo.familyPhone} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Emergency Tab */}
                            {activeTab === 'emergency' && selectedApplication.emergencyInfo && (
                                <div>
                                    <div style={{
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <AlertTriangle size={20} />
                                            Emergency Contact Information
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                            gap: '1.25rem'
                                        }}>
                                            <FormField label="Full Name" value={selectedApplication.emergencyInfo.fullName} />
                                            <FormField label="Relationship" value={selectedApplication.emergencyInfo.relationship} />
                                            <FormField label="Phone" value={selectedApplication.emergencyInfo.phone} />
                                            <FormField label="Email" value={selectedApplication.emergencyInfo.email} />
                                            <FormField label="Job" value={selectedApplication.emergencyInfo.job} />
                                            <FormField label="Woreda" value={selectedApplication.emergencyInfo.woreda} />
                                            <FormField label="Home Town" value={selectedApplication.emergencyInfo.homeTown} />
                                            <FormField label="Kebele" value={selectedApplication.emergencyInfo.kebele} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Export Filter Modal */}
            {showExportModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: exportType === 'pdf' 
                                ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                    Export to {exportType === 'pdf' ? 'PDF' : 'CSV'}
                                </h2>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                                    Select filters to export specific applications
                                </p>
                            </div>
                            <button
                                onClick={() => setShowExportModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                            {/* Filter Type Selection */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.75rem', 
                                    fontWeight: 600, 
                                    color: '#1e293b',
                                    fontSize: '0.95rem'
                                }}>
                                    Export Type
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        { value: 'all', label: 'All Students', desc: `Export all ${applications.length} applications` },
                                        { value: 'studentId', label: 'Specific Student', desc: 'Search by Student ID' },
                                        { value: 'batch', label: 'By Batch', desc: 'Filter by academic year' },
                                        { value: 'department', label: 'By Department', desc: 'Filter by department' },
                                        { value: 'combined', label: 'Combined Filters', desc: 'Batch + Department' }
                                    ].map(option => (
                                        <label
                                            key={option.value}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                border: exportFilters.filterType === option.value 
                                                    ? '2px solid #3b82f6' 
                                                    : '2px solid #e5e7eb',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                background: exportFilters.filterType === option.value 
                                                    ? '#eff6ff' 
                                                    : 'white'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (exportFilters.filterType !== option.value) {
                                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (exportFilters.filterType !== option.value) {
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="filterType"
                                                value={option.value}
                                                checked={exportFilters.filterType === option.value}
                                                onChange={(e) => setExportFilters({
                                                    ...exportFilters,
                                                    filterType: e.target.value,
                                                    batch: '',
                                                    department: '',
                                                    studentId: ''
                                                })}
                                                style={{ 
                                                    marginRight: '1rem',
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
                                                    {option.label}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                    {option.desc}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Student ID Search */}
                            {exportFilters.filterType === 'studentId' && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.75rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Student ID (e.g., RU/1270/18)"
                                        value={exportFilters.studentId}
                                        onChange={(e) => setExportFilters({
                                            ...exportFilters,
                                            studentId: e.target.value
                                        })}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                            )}

                            {/* Batch Selection */}
                            {(exportFilters.filterType === 'batch' || exportFilters.filterType === 'combined') && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.75rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Academic Year (Batch)
                                    </label>
                                    <select
                                        value={exportFilters.batch}
                                        onChange={(e) => setExportFilters({
                                            ...exportFilters,
                                            batch: e.target.value
                                        })}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    >
                                        <option value="">Select Batch</option>
                                        {getUniqueBatches().map(batch => (
                                            <option key={batch} value={batch}>{batch}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Department Selection */}
                            {(exportFilters.filterType === 'department' || exportFilters.filterType === 'combined') && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.75rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Department
                                    </label>
                                    <select
                                        value={exportFilters.department}
                                        onChange={(e) => setExportFilters({
                                            ...exportFilters,
                                            department: e.target.value
                                        })}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    >
                                        <option value="">Select Department</option>
                                        {getUniqueDepartments().map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Preview Count */}
                            <div style={{
                                padding: '1rem',
                                background: '#f0f9ff',
                                border: '2px solid #bae6fd',
                                borderRadius: '10px',
                                marginTop: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Filter size={18} color="#0284c7" />
                                    <span style={{ fontWeight: 600, color: '#0c4a6e' }}>
                                        {getFilteredApplications().length} application(s) will be exported
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowExportModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    color: '#64748b',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.color = '#475569';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.color = '#64748b';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExportWithFilters}
                                disabled={getFilteredApplications().length === 0}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: getFilteredApplications().length === 0 
                                        ? '#9ca3af' 
                                        : exportType === 'pdf'
                                            ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: getFilteredApplications().length === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    opacity: getFilteredApplications().length === 0 ? 0.6 : 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (getFilteredApplications().length > 0) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (getFilteredApplications().length > 0) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                {exportType === 'pdf' ? <FileText size={18} /> : <Download size={18} />}
                                Export {getFilteredApplications().length} Application(s)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for displaying form fields (read-only)
const FormField = ({ label, value, required }) => (
    <div>
        <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: 600, 
            color: '#1e293b', 
            fontSize: '0.95rem',
            letterSpacing: '-0.2px'
        }}>
            {label} {required && <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>}
        </label>
        <input
            type="text"
            value={value || '-'}
            readOnly
            style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)',
                color: '#1e293b',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
        />
    </div>
);

// Helper component for displaying info fields
const InfoField = ({ label, value }) => (
    <div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
            {label}
        </div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>
            {value || '-'}
        </div>
    </div>
);

export default Applications;
