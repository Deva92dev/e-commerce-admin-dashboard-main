## Necessary Things for starting the project

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

MONGO_URI=

# Change for Production

NEXT_PUBLIC_BASE_URL=

# Admin user Client(Must), ChANGE FOR ADMIN userId got from clerk

ADMIN_USER_ID=

# Cloudinary

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Payments with RazorPay

RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

## Add your todo's for entire project. It will help you for future projects

## Customize your shadcn components according to your need

## Clerk Authentication

- Go to the clerk docs , start a new project and do everything as the docs says.

### Dashboard

- Start building Dashboard with Sidenav and TopBar (make separate file for navIcons), make reusable components of them so that you can put them in layout.tsx file of admin dashboard and also customize them according to screen sizes
- Dashboard, Collections, Products, Customers, Orders , edit Profile, these are pages of dashboard , customize them according to projects
- Use Lucide.dev or any other icon library and Shadcn or any other component library according to your choice.
- Create a new page in collections page and a new collection using shadcn form(all the things mentioned in shadcn docs so that you can use them), customize them according to your need.
- Make collectionForm as a coponent so that you can reuse for the other tasks
- use next-cloudinary to set up cloudinary with image upload, set up project, make adjustment with the code according to the docs, use delight-Food UploadImage as source and make for other projects.
- After that make Collection Model using mongoose and mongoDB/any other database connect file.

# APIs in Dashboard

- Create API folder , collection folder in it, route.ts file
- POSt route for creating collection function named POST
- use userId from auth(from clerk/nextjs/server) for authenticating POST route, UPDATE route and DELETE route
- for GET no need to check for authentication
- All these for creating a database data after submitting the create collection data in onSubmit function

## Collection page

# new page of collection

- use states for storing values
- use react-hot-toast to show notifications for various thing, make a ToastProvider component use it in layout file
- while creating new collection have title, description, image for that UploadImage for image

# collection page

- use data-table, collection-columns from shadcn ui to set up collection page, not new page in collection
- Create GET route in route.ts file of collection for fetching collections from database.
- Fetch data and show them on collection main page, also have delete functionality for each collection.
- Using shadcn data-table component docs make necessary files and actions for each collection which being showed on page.
- for delete functionality create DELETE function in dynamic route.ts file
- GET and UPDATE routes using GET and POST function names in dynamic route.ts file for updating or fetching data for specific collections(Ids)
- for each collection, make a cell row in column.tsx file as mentioned in shadcn docs, use Delete custom-component . Have as many cells as you need and also make use of them by writing title, length etc of collections.
- Also have search input from shadcn docs so that you can search collections, use Data-table docs of shadcn. Have searchKey as a prop in Data-Table component
- Use Alert Dialogue for Delete component and customize it
- use dynamic route.st DELETE function in this Delete component to delete collection from database.
- use some function for fetching that DELETE api and delete functionality. Then use it at appropriate place.
- And when you click on these specific collection id, it leads to their dynamic page while using dynamic route.ts file code of GET.
- Same for updating specific collection
- make Dynamic collectionId page so that you fetch dynamic data using dynamic route.ts codes
- Pass initialData(type will be CollectionType) to CollectionForm as a prop and make it optional and modify collectionForm for creating and updating collections.
- Use handleKeyPress function,in case accidentally clicking enter tab, so that it disable submitting the form.

## Products Page

- Create new page, add routes everything like collections

### E-Commerce Section Start
