B.1 System Requirements

The application requires users to run the make command which is known to have issues with
the MacOS. To avoid this it is preferred to run the application on either Windows or Linux.
Currently these are the minimum requirements for the application to have the best results:

OS Windows 10 or later, Ubuntu 18.04LTS or later
Processor 1Ghz
RAM 2GB
Storage 600MB available space

B.2 Prerequisites

Install Docker from the link below choosing the relevant operating system and clone the planning
service API.

https://docs.docker.com/get-docker/

git clone https://github.com/AI-Planning/planning-as-a-service

Go to the ’docker-compose.yml’ file in the planning-as-a-service folder and locate the ’mysql’
section.

Change the ports from ’3306:3306’ to ’3307:3306’ Install the make command on your
device, depending on your platform there are different methods for this:
• Windows: download GNU directly from the link below:
https://gnuwin32.sourceforge.net/packages/make.htm

or use Chocolatey:
https://chocolatey.org/install

and install the make command by running this in the terminal:

‘choco install make’

Alternatively you can install Linux on Windows with WSL using the in depth tutorial
below:

https://learn.microsoft.com/en-us/windows/wsl/install

• Ubuntu: Linux should already have the make command in its build-essentials package.
However, you need to make sure it is already installed using:

‘make -v’

if it is not installed, then run these commands:

‘sudo apt-get update’
‘sudo apt-get -y install make’

B.3 Running the Planning-as-a-service API

1. Run Docker in the background first
2. Open ‘planning-as-a-service’ with a code editor e.g. VSCode, or open the folder in a
   terminal
3. Open a new terminal, skip this step if folder is already open in terminal
4. Run ‘cd server’
5. Run ‘sudo make’ if using Linux/ WSL or run ‘make’ if using Windows with GNU installed
6. This will build the Dockerfile and can be viewed and accessed on the Docker Desktop
   software on the containers tab under the name ‘server’
7. In your browser go to: ‘http://localhost:5001/package/optic/solve’ to see a description
   of the planner used
   54
8. Go to: ‘http://localhost:5555’ to view the flower monitor where any requests made to the
   service are displayed; username=‘username’ and password=’password’
9. Go to: ‘http://localhost:5001/docs/optic’ to see the documentation for the planner

B.4 Getting Started

1. Make sure that the planning-as-a-serivice API is running in the background
2. Open the Explainable AI Planning software in a code editor e.g. VSCode, or open the
   folder in terminal
3. Open a new terminal, skip this step if folder is open in a terminal
4. Run 'npm install' to install the dependencies and then ‘npm run dev’
5. Click on the link shown in the terminal output, or type in ‘o’ and press enter to open the
   website in the browser

   B.5 Generating Plans

   The bar located at the top of the page contains two links which are useful for finding samples
   of domain and problem files previously used in the International Planning Competitions. The
   domain and problem section are labelled respectively with a large text area for user input.
   Below are save buttons which saves the user input. Upon clicking this, the input is displayed
   and an edit button will replace them to allow you modify the input.

   The find plan button is situated at the bottom right of the website and will only generate
   a plan if valid domain and problem files are posted.

   The plan is displayed beneath the problem section consisting of the time taken and each
   individual steps to reach the goal.

   Underneath the plan consists of three buttons. The reset button will remove the plan
   allowing the user to regenerate the plan. The remaining two buttons are queries about the
   original plan.

   Interacting with these two buttons will prompt an input box to appear where you can type
   in your action A and B.

   After inputting these actions, a new plan is generated depending on the question asked and
   any differences are highlighted in red.

   The plan visualisations are displayed below the plan comparison, a directed graph is generated with the original plan in sky blue and the new plan in a light red colour. You can zoom in and out of this graph using the mouse wheel, and drag the nodes around by clicking on them.
   Dragging the screen will move across the graph.

   The final feature of the website is the bar chart. It plots the actions against the state number.
   The original plan is in blue and the new plan is in red. Clicking on the key will remove that
   plan from view. Hovering over the specific bar will show a box with the information regarding
   the bar.
