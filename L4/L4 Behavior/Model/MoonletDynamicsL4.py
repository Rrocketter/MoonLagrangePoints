import numpy as np
from scipy.integrate import odeint

G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters


# Function to calculate gravitational force components
def gravitational_force(x, y, M1, M2):
    r = np.sqrt(x ** 2 + y ** 2)
    force_x = -G * M1 * x / r ** 3 - G * M2 * x / r ** 3
    force_y = -G * M1 * y / r ** 3 - G * M2 * y / r ** 3
    return force_x, force_y


# Function to define the differential equations
def equations_of_motion(state, t, M1, M2, M3, M4):
    x1, y1, vx1, vy1, x2, y2, vx2, vy2 = state
    force_x1, force_y1 = gravitational_force(x1 - x2, y1 - y2, M1, M2)
    force_x2, force_y2 = gravitational_force(x2 - x1, y2 - y1, M3, M4)

    dx1dt = vx1
    dy1dt = vy1
    dvx1dt = (force_x1 / M2) + (force_x2 / M4)
    dvy1dt = (force_y1 / M2) + (force_y2 / M4)

    dx2dt = vx2
    dy2dt = vy2
    dvx2dt = (force_x2 / M4) + (force_x1 / M2)
    dvy2dt = (force_y2 / M4) + (force_y1 / M2)

    return [dx1dt, dy1dt, dvx1dt, dvy1dt, dx2dt, dy2dt, dvx2dt, dvy2dt]


# Function to calculate Lagrange point L4 location
def lagrange_point_l4_location(theta):
    x_l4 = 0.5 * R_earth_moon * np.cos(theta)
    y_l4 = (np.sqrt(3) / 2) * R_earth_moon * np.sin(theta)
    return x_l4, y_l4


# Function to simulate moonlet's motion
def simulate_orbit(moonlet_mass1, moonlet_mass2, initial_distance_earth_moon, time_span, time_step):
    theta_moon = 0  # Initial angle for Moon's position
    theta_l4 = 0  # Initial angle for Lagrange point L4

    initial_state = [R_earth_moon + initial_distance_earth_moon, 0, 0, 2 * np.pi * R_earth_moon / (27.3 * 24 * 3600),
                     R_earth_moon + initial_distance_earth_moon + 1e7, 0, 0,
                     2 * np.pi * R_earth_moon / (27.3 * 24 * 3600)]  # Initial positions and velocities

    times = np.arange(0, time_span * 365, time_step)  # Time span is in years, convert to days

    moonlet_timeseries = []

    for t in times:
        theta_moon = (2 * np.pi * t) / (27.3 * 24 * 3600)  # Update Moon's angle based on its orbital period
        x_l4, y_l4 = lagrange_point_l4_location(theta_l4)

        state = odeint(equations_of_motion, initial_state, [0, time_step],
                       args=(M_earth, moonlet_mass1, M_earth, moonlet_mass2))
        initial_state = state[-1, :]

        x_moon = R_earth_moon * np.cos(theta_moon)
        y_moon = R_earth_moon * np.sin(theta_moon)

        moonlet_positions = [t, x_moon, y_moon, initial_state[0], initial_state[1], initial_state[4], initial_state[5],
                             x_l4, y_l4]
        moonlet_timeseries.append(moonlet_positions)

        theta_l4 += 2 * np.pi * time_step / (
                    27.3 * 24 * 3600)  # Update Lagrange point L4's angle based on Moon's orbital period

    return moonlet_timeseries


# Example values
moonlet_mass1 = 1e18
moonlet_mass2 = 1e19
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_timeseries = simulate_orbit(moonlet_mass1, moonlet_mass2, initial_distance_earth_moon, time_span_years,
                                    time_step_days)

# Print header
print(
    "Time (days) | Moon X Position (m) | Moon Y Position (m) | Moonlet1 X Position (m) | Moonlet1 Y Position (m) | Moonlet2 X Position (m) | Moonlet2 Y Position (m) | L4 X Position (m) | L4 Y Position (m)")

# Print data
for entry in moonlet_timeseries:
    print(
        f"{entry[0]:.2f} | {entry[1]:.2f} | {entry[2]:.2f} | {entry[3]:.2f} | {entry[4]:.2f} | {entry[5]:.2f} | {entry[6]:.2f} | {entry[7]:.2f} | {entry[8]:.2f}")
