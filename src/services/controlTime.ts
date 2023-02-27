import axios from './axios';

export class ControlTime {
    static controlTime = async () => await axios.get(`/control-time`)
}