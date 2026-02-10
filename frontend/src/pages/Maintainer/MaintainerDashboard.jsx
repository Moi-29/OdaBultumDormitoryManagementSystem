import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, FileText, Wrench, LogOut, User, CheckCircle, Clock, Send, X, Plus, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const MaintainerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        subject: '',
        message: '',
        priority: 'medium',
        requestType: 'Tool Request'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'maintainer') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [statsRes, requestsRes, workOrdersRes] = await Promise.all([
                axios.get(`${API_URL}/api/maintainer/stats`, config),
                axios.get(`${API_URL}/api/maintainer/requests`, config),
                axios.get(`${API_URL}/api/maintainer/work-orders`, config)
            ]);

            if (statsRes.data.success) setStats(statsRes.data.stats);
            if (requestsRes.data.success) setRequests(requestsRes.data.requests);
            if (workOrdersRes.data.success) setWorkOrders(workOrdersRes.data.workOrders);
        } catch (error) {
            console.error('Error fetching data:', error);
