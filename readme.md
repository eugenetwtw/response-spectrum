# Earthquake Time History and Response Spectrum Analysis

## Description

This web application allows users to upload earthquake time history data from a TXT file, and then visualizes both the time history and the calculated response spectrum for three orthogonal directions (Vertical - U, North-South - N, and East-West - E). Users can also download the calculated response spectrum data.

## Features

-   **Upload Time History Data**: Users can upload a TXT file containing earthquake acceleration data.
-   **Time History Plots**: Displays time history plots (acceleration vs. time) for U, N, and E directions.
-   **Response Spectrum Calculation**: Calculates the response spectrum for a 5% damping ratio across a range of periods (0.01s to 5.0s).
-   **Response Spectrum Plots**: Displays response spectrum plots (spectral acceleration vs. period) on a log-log scale for U, N, and E directions.
-   **Data Download**: Allows users to download the calculated response spectrum data for each direction as a TXT file.

## How to Use

1.  **Open the Application**: Open the `index.html` file in a web browser.
2.  **Upload Data**:
    *   Click the "Choose File" button.
    *   Select a TXT file containing the time history data in the specified format (see below).
3.  **Process Data**: Click the "Process Data" button.
4.  **View Results**:
    *   The application will display six plots:
        *   Time History for U, N, and E directions.
        *   Response Spectrum for U, N, and E directions.
    *   The Y-axis for acceleration in Time History plots and Spectral Acceleration in Response Spectrum plots is in 'gal' (cm/s²).
5.  **Download Data**:
    *   Once the data is processed, the "Download Response Spectrum" buttons for each direction will be enabled.
    *   Click the desired button to download the response spectrum data as a tab-separated TXT file (`period \t spectral_acceleration`).

## Input File Format (TXT)

The input TXT file should adhere to the following format:

*   Lines starting with a `#` symbol are treated as comments and are ignored by the parser.
*   Data lines should contain space-separated numerical values.
*   Each data line must represent a time step and should include at least four values:
    1.  `Time` (seconds)
    2.  `Acceleration U (Vertical)` (gal)
    3.  `Acceleration N (North-South)` (gal)
    4.  `Acceleration E (East-West)` (gal)

**Example Data Lines:**

```
#StationCode: TCU049
#StartTime: 1999/09/20-17:47:04.000 
#DataSequence: Time U(+); N(+); E(+)
#Data: 4F10.3 
     0.000     0.096    -0.310    -0.082
     0.005    -0.083    -0.968     0.815
     0.010    -0.262     0.168     0.516
```

*(Note: The application assumes input accelerations are in 'gal' (cm/s²). The response spectrum calculation internally converts these to 'g' for the SDOF analysis and then converts the resulting spectral accelerations back to 'gal' for plotting and download.)*

**Note on cx921.txt**: The file `cx921.txt` included with this application contains data from the 1999/9/21 earthquake in Taiwan (also known as the Chi-Chi Earthquake). It serves as a sample dataset to demonstrate the functionality of this web app.*

## Technologies Used

-   HTML
-   CSS
-   JavaScript
-   [Chart.js](https://www.chartjs.org/) - For plotting graphs.
