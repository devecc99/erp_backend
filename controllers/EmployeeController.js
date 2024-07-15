const ResponseManager = require("../middleware/ResponseManager");
const {
  Employee,
  Position,
  Salary_pay,
  Department,
} = require("../model/employeeModel"); // call model

class EmployeeController {
  static async getEmployee(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Employee และ Position
      Employee.belongsTo(Position, { foreignKey: "PositionID" });
      Position.hasMany(Employee, { foreignKey: "PositionID" });

      // กำหนดความสัมพันธ์ระหว่าง Employee และ Department
      Employee.belongsTo(Department, { foreignKey: "departmentID" });
      Department.hasMany(Employee, { foreignKey: "departmentID" });

      var employees = await Employee.findAll({
        include: [{ model: Position }, { model: Department }],
      });

      await ResponseManager.SuccessResponse(req, res, 200, employees);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddEmployee(req, res) {
    //add category
    try {
      const addemp = await Employee.findOne({
        where: {
          NID_num: req.body.NID_num,
        },
      });
      if (addemp) {
        await ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Employee already exit"
        );
      } else {
        const insert_emp = await Employee.create({
          title: req.body.title,
          F_name: req.body.F_name,
          L_name: req.body.L_name,
          Address: req.body.Address,
          Birthdate: req.body.Birthdate,
          NID_num: req.body.NID_num,
          Phone_num: req.body.Phone_num,
          Email: req.body.Email,
          start_working_date: req.body.start_working_date,
          Salary: req.body.Salary,
          employeeType: req.body.employeeType,
          bankName: req.body.bankName,
          bankAccountID: req.body.bankAccountID,
          PositionID: req.body.PositionID,
          departmentID: req.body.departmentID,
        });
        console.log(req.body);
        await ResponseManager.SuccessResponse(req, res, 200, insert_emp);
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditEmployee(req, res) {
    //add product
    try {
      const editemp = await Employee.findOne({
        where: {
          employeeID: req.params.id,
        },
      });
      if (editemp) {
        await Employee.update(
          {
            title: req.body.title,
            F_name: req.body.F_name,
            L_name: req.body.L_name,
            Address: req.body.Address,
            Birthdate: req.body.Birthdate,
            NID_num: req.body.NID_num,
            Phone_num: req.body.Phone_num,
            Email: req.body.Email,
            start_working_date: req.body.start_working_date,
            Salary: req.body.Salary,
            employeeType: req.body.employeeType,
            bankName: req.body.bankName,
            bankAccountID: req.body.bankAccountID,
            PositionID: req.body.PositionID,
            DepartmentID: req.body.DepartmentID,
          },
          {
            where: {
              employeeID: req.params.id,
            },
          }
        );
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee Updated"
        );
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No Employee found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteEmployee(req, res) {
    //delete product
    try {
      const deletecate = await Employee.findOne({
        where: {
          employeeID: req.params.id,
        },
      });
      if (deletecate) {
        await Employee.destroy({
          where: {
            employeeID: req.params.id,
          },
        });
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee Deleted"
        );
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No Employee found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddDepartment(req, res) {
    //add category
    try {
      const adddepart = await Department.findOne({
        where: {
          departmentName: req.body.departmentName,
        },
      });
      if (adddepart) {
        await ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Department already exists"
        );
      } else {
        const insert_depart = await Department.create({
          departmentName: req.body.departmentName,
        });
        console.log(req.body);
        await ResponseManager.SuccessResponse(req, res, 200, insert_depart);
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditDepartment(req, res) {
    //add product
    try {
      const editemp = await Department.findOne({
        where: {
          departmentID: req.params.id,
        },
      });
      if (editemp) {
        await Department.update(
          {
            departmentName: req.body.departmentName,
          },
          {
            where: {
              departmentID: req.params.id,
            },
          }
        );
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Department Updated"
        );
      } else {
        await ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Department found"
        );
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteDepartment(req, res) {
    //delete product
    try {
      const deletecate = await Department.findOne({
        where: {
          departmentID: req.params.id,
        },
      });
      if (deletecate) {
        await Department.destroy({
          where: {
            departmentID: req.params.id,
          },
        });
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Department Deleted"
        );
      } else {
        await ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Department found"
        );
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getDepartment(req, res) {
    try {
      const departments = await Department.findAll();

      let datalist = [];

      for (const property in departments) {
        const data = {};
        data.departmentID = departments[property].departmentID;
        data.departmentName = departments[property].departmentName;

        const employee = await Employee.findAll({
          where: {
            departmentID: departments[property].departmentID.toString(),
          },
        });

        data.sumEmployee = employee.length;
        datalist.push(data);
      }
      await ResponseManager.SuccessResponse(req, res, 200, datalist);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getPayment(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Table1 และ Table2
      Salary_pay.hasMany(Employee, { foreignKey: "employeeID" });
      Employee.belongsTo(Salary_pay, { foreignKey: "employeeID" });

      // กำหนดความสัมพันธ์ระหว่าง Table2 และ Table3
      Employee.hasMany(Position, { foreignKey: "PositionID" });
      Position.belongsTo(Employee, { foreignKey: "PositionID" });

      // ดึงข้อมูลจาก Table1 พร้อมทั้ง Table2 และ Table3
      const result = await Salary_pay.findAll({
        include: [
          { model: Employee, include: [Position] }, // เชื่อมโยง Table2 และ Table3
        ],
      });

      await ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddPosition(req, res) {
    //add category
    try {
      const adddepart = await Position.findOne({
        where: {
          Position: req.body.Position,
        },
      });
      if (adddepart) {
        await ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Position already exists"
        );
      } else {
        const insert_depart = await Position.create({
          Position: req.body.Position,
        });
        console.log(req.body);
        await ResponseManager.SuccessResponse(req, res, 200, insert_depart);
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditPosition(req, res) {
    //add product
    try {
      const editemp = await Position.findOne({
        where: {
          PositionID: req.params.id,
        },
      });
      if (editemp) {
        await Position.update(
          {
            Position: req.body.Position,
          },
          {
            where: {
              PositionID: req.params.id,
            },
          }
        );
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Position Updated"
        );
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No Position found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeletePosition(req, res) {
    //delete product
    try {
      const deletecate = await Position.findOne({
        where: {
          PositionID: req.params.id,
        },
      });
      if (deletecate) {
        await Position.destroy({
          where: {
            PositionID: req.params.id,
          },
        });
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Position Deleted"
        );
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No Position found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getPosition(req, res) {
    try {
      const Positions = await Position.findAll();
      await ResponseManager.SuccessResponse(req, res, 200, Positions);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddPayment(req, res) {
    //add category
    try {
      const data = await Salary_pay.findOne({
        where: {
          month: req.body.month,
          round: req.body.round,
          year: req.body.year,
          employeeID: req.body.employeeID,
        },
      });
      if (data) {
        await ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Employee Payment already exists"
        );
      } else {
        const data_payment = await Salary_pay.create({
          employeeID: req.body.employeeID,
          Date: req.body.Date,
          round: req.body.round,
          month: req.body.month,
          year: req.body.year,
        });
        console.log(req.body);
        await ResponseManager.SuccessResponse(req, res, 200, data_payment);
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddPayment2(req, res) {
    try {
        // ตรวจสอบว่ามีข้อมูลใน req.body.payments หรือไม่
        if (!req.body.payments || !Array.isArray(req.body.payments)) {
            return res.status(400).json({ error: 'Invalid request format. Missing payments array.' });
        }

        const paymentCreationPromises = [];

        for (const paymentData of req.body.payments) {
            // เพิ่มตรวจสอบเพิ่มเติมตามความเหมาะสม เช่น ตรวจสอบข้อมูล paymentData ก่อนที่จะใช้ในการสร้างรายการเงินเดือน
            // ตรวจสอบว่ามีรายการเงินเดือนที่มีเงื่อนไขของ month, round, year, และ employeeID ที่ซ้ำกันหรือไม่
            const existingPayment = await Salary_pay.findOne({
                where: {
                    month: paymentData.month,
                    round: paymentData.round,
                    year: paymentData.year,
                    employeeID: paymentData.employeeID
                }
            });

            if (existingPayment) {
                return res.status(400).json({ error: 'Duplicate payment entry.' });
            } else {
                // ไม่พบรายการที่ซ้ำ ดังนั้นเพิ่มรายการเงินเดือนใหม่
                paymentCreationPromises.push(Salary_pay.create({
                    employeeID: paymentData.employeeID,
                    Date: paymentData.Date,
                    round: paymentData.round,
                    month: paymentData.month,
                    year: paymentData.year,
                }));
            }
        }

        // รอให้การสร้างรายการเสร็จสมบูรณ์ทั้งหมด
        const createdPayments = await Promise.all(paymentCreationPromises);
        res.status(200).json(createdPayments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

}

module.exports = EmployeeController;