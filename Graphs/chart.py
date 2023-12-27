import numpy as np
import matplotlib.pyplot as plt

# Moon dimensions data
moon_dimensions = {
    # "Mass (1024 kg)" :	0.07346,
    # "Volume (10^10 km^3)"	: 2.1968,
    # "Equatorial radius (km)"	:1738.1,
    # "Polar radius (km)"	: 1736.0,
    # "Volumetric mean radius (km)": 1737.4,
    # "Ellipticity (Flattening)": 	0.0012,
    # "Mean density (kg/m3)": 	3344,
    # "Surface gravity (m/s2)": 	1.62,
    # "Surface acceleration (m/s2)"	: 1.62,
    # "Escape velocity (km/s)": 	2.38,
    # "GM (x 106 km3/s2)": 	0.00490	,
    # "V-band magnitude V(1,0)" : 	-0.08,
    # "Solar irradiance (W/m2)"	: 1361.0	,
    # "Moment of inertia (I/MR2)"	: 0.394	,
    # "Semimajor axis (106 km)"	: 0.3844,
    "Perigee (106 km)*":	0.3633,
    "Apogee (106 km)*	": 0.4055,
    "Revolution period (days)":	27.3217,
    "Synodic period (days)":	29.53,
    "Mean orbital velocity (km/s)":	1.022,
    "Max. orbital velocity (km/s)":	1.082,
    "Min. orbital velocity (km/s)":	0.970,
    "Inclination to ecliptic (deg)":	5.145,
    "Inclination to Earth equator (deg)":	18.28 - 28.58,
    "Orbit eccentricity":	0.0549,
    "Sidereal rotation period (hrs)":	655.720,
    "Obliquity to orbit (deg)":	6.68,
    "Recession rate from Earth (cm/yr)":	3.8,

}

# Extract dimension names and values
dimension_names = list(moon_dimensions.keys())
dimension_values = list(moon_dimensions.values())

# Create a NumPy array for the data
data = np.array([dimension_names, dimension_values])

# Create a figure and axis for the table
fig, ax = plt.subplots()

# Hide the axes
ax.axis('off')

# Create a table
table = ax.table(cellText=data.T, loc="center", cellLoc="center")

# Adjust the table layout
table.auto_set_font_size(False)
table.set_fontsize(14)
table.scale(1.5, 1.5)  # Adjust the scale for better readability

# Show the table
plt.show()
