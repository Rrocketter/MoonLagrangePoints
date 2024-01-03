import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint
from matplotlib.animation import FuncAnimation

G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters

# Function to calculate gravitational force components
def gravitational_force(x, y, M1, M2):
    r = np.sqrt(x**2 + y**2)
    force_x = -G * M1 * x / r**3 - G * M2 * x / r**3
    force_y = -G * M1 * y / r**3 - G * M2 * y / r**3
    return force_x, force_y

# Function to define the differential equations
def equations_of_motion(state, t, M1, M2):
    x, y, vx, vy = state
    force_x, force_y = gravitational_force(x, y, M1, M2)
    dxdt = vx
    dydt = vy
    dvxdt = force_x / M2
    dvydt = force_y / M2
    return [dxdt, dydt, dvxdt, dvydt]

# Function to calculate Lagrange point L4 location
def lagrange_point_l4_location(theta):
    x_l4 = 0.5 * R_earth_moon * np.cos(theta)
    y_l4 = (np.sqrt(3) / 2) * R_earth_moon * np.sin(theta)
    return x_l4, y_l4

# Function to simulate moonlet's motion
def simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span, time_step):
    theta_moon = 0  # Initial angle for Moon's position
    theta_l4 = 0  # Initial angle for Lagrange point L4

    initial_state = [R_earth_moon + initial_distance_earth_moon, 0, 0, 2 * np.pi * R_earth_moon / (27.3 * 24 * 3600)]  # Initial position at Moon's location with Moon's orbital velocity
    times = np.arange(0, time_span * 365, time_step)  # Time span is in years, convert to days

    moonlet_timeseries = []

    for t in times:
        theta_moon = (2 * np.pi * t) / (27.3 * 24 * 3600)  # Update Moon's angle based on its orbital period
        x_l4, y_l4 = lagrange_point_l4_location(theta_l4)

        state = odeint(equations_of_motion, initial_state, [0, time_step], args=(M_earth, moonlet_mass))
        initial_state = state[-1, :]

        x_moon = R_earth_moon * np.cos(theta_moon)
        y_moon = R_earth_moon * np.sin(theta_moon)

        moonlet_positions = [t, x_moon, y_moon, initial_state[0], initial_state[1], x_l4, y_l4]
        moonlet_timeseries.append(moonlet_positions)

        theta_l4 += 2 * np.pi * time_step / (27.3 * 24 * 3600)  # Update Lagrange point L4's angle based on Moon's orbital period

    return moonlet_timeseries

# Example values
moonlet_mass = 1e18
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_timeseries = simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span_years, time_step_days)

def update_plot(frame, moonlet_scatter, l4_scatter, earth_scatter, moonlet_timeseries):
    moonlet_scatter.set_offsets((moonlet_timeseries[frame][3], moonlet_timeseries[frame][4]))
    l4_scatter.set_offsets((moonlet_timeseries[frame][5], moonlet_timeseries[frame][6]))
    earth_scatter.set_offsets((0, 0))
def animate_orbit(moonlet_timeseries):
    fig, ax = plt.subplots()

    moonlet_scatter = ax.scatter([], [], color='blue', label='Moonlet', s=20)
    l4_scatter = ax.scatter([], [], color='red', label='L4 Point', s=20)
    earth_scatter = ax.scatter([], [], color='yellow', label='Earth', s=200)

    ax.set_xlim(-1.5e9, 1.5e9)
    ax.set_ylim(-1.5e9, 1.5e9)
    ax.set_title('Moonlet Motion and Lagrange Point L4')
    ax.set_xlabel('X Position (m)')
    ax.set_ylabel('Y Position (m)')
    ax.legend()
    ax.grid(True)

    # Create the animation
    animation = FuncAnimation(fig, update_plot, frames=len(moonlet_timeseries),
                              fargs=(moonlet_scatter, l4_scatter, earth_scatter, moonlet_timeseries),
                              interval=50, repeat=False)

    plt.show()


# Example values
moonlet_mass = 1e18
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_timeseries = simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span_years, time_step_days)

# Create and display the animation
animate_orbit(moonlet_timeseries)